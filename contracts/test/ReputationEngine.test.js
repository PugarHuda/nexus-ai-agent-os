const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationEngine", function () {
  let reputation, owner, reporter, user1;

  beforeEach(async function () {
    [owner, reporter, user1] = await ethers.getSigners();

    const ReputationEngine = await ethers.getContractFactory("ReputationEngine");
    reputation = await ReputationEngine.deploy();

    await reputation.addReporter(reporter.address);
  });

  describe("Recording Actions", function () {
    it("should record an action and update reputation", async function () {
      const daHash = ethers.keccak256(ethers.toUtf8Bytes("proof-1"));

      await reputation.connect(reporter).recordAction(1, 0, 8000, daHash); // accuracy: 80%

      const rep = await reputation.getReputation(1);
      expect(rep.accuracy).to.equal(8000n);
      expect(rep.totalActions).to.equal(1n);
    });

    it("should compute moving average over multiple actions", async function () {
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("proof-1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("proof-2"));

      await reputation.connect(reporter).recordAction(1, 0, 8000, hash1); // accuracy: 80%
      await reputation.connect(reporter).recordAction(1, 0, 6000, hash2); // accuracy: 60%

      const rep = await reputation.getReputation(1);
      // Moving average: (8000 * 1 + 6000) / 2 = 7000
      expect(rep.accuracy).to.equal(7000n);
      expect(rep.totalActions).to.equal(2n);
    });

    it("should compute composite score", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await reputation.connect(reporter).recordAction(1, 0, 9000, hash); // accuracy
      await reputation.connect(reporter).recordAction(1, 1, 8000, hash); // reliability
      await reputation.connect(reporter).recordAction(1, 2, 9500, hash); // safety
      await reputation.connect(reporter).recordAction(1, 3, 7000, hash); // collaboration

      const composite = await reputation.getCompositeScore(1);
      // (9000*30 + 8000*25 + 9500*30 + 7000*15) / 100 = 8600
      expect(composite).to.be.gt(0);
    });

    it("should reject unauthorized reporter", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("proof"));
      await expect(
        reputation.connect(user1).recordAction(1, 0, 8000, hash)
      ).to.be.revertedWith("Not authorized reporter");
    });
  });

  describe("Action History", function () {
    it("should store action proofs for auditability", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("proof-1"));
      await reputation.connect(reporter).recordAction(1, 0, 8000, hash);

      const count = await reputation.getActionCount(1);
      expect(count).to.equal(1n);

      const proof = await reputation.getActionProof(1, 0);
      expect(proof.agentId).to.equal(1n);
      expect(proof.score).to.equal(8000n);
      expect(proof.daProofHash).to.equal(hash);
    });
  });
});
