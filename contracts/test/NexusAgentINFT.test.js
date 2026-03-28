const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NexusAgentINFT", function () {
  let agentINFT, oracle, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();

    const NexusAgentINFT = await ethers.getContractFactory("NexusAgentINFT");
    agentINFT = await NexusAgentINFT.deploy(await oracle.getAddress());
  });

  describe("Minting", function () {
    it("should mint an agent INFT", async function () {
      const uri = "0g://encrypted-metadata-hash";
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test-metadata"));

      const tx = await agentINFT.mintAgent(user1.address, uri, hash);
      const receipt = await tx.wait();

      expect(await agentINFT.ownerOf(1)).to.equal(user1.address);
      expect(await agentINFT.encryptedURI(1)).to.equal(uri);
      expect(await agentINFT.metadataHash(1)).to.equal(hash);
    });

    it("should increment token IDs", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await agentINFT.mintAgent(user1.address, "uri1", hash);
      await agentINFT.mintAgent(user2.address, "uri2", hash);

      expect(await agentINFT.ownerOf(1)).to.equal(user1.address);
      expect(await agentINFT.ownerOf(2)).to.equal(user2.address);
      expect(await agentINFT.totalSupply()).to.equal(2);
    });
  });

  describe("Authorized Usage", function () {
    beforeEach(async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await agentINFT.mintAgent(user1.address, "uri", hash);
    });

    it("should authorize usage", async function () {
      const permissions = ethers.toUtf8Bytes("read,execute");
      await agentINFT.connect(user1).authorizeUsage(1, user2.address, permissions);
      expect(await agentINFT.isAuthorized(1, user2.address)).to.be.true;
    });

    it("should revoke usage", async function () {
      const permissions = ethers.toUtf8Bytes("read");
      await agentINFT.connect(user1).authorizeUsage(1, user2.address, permissions);
      await agentINFT.connect(user1).revokeUsage(1, user2.address);
      expect(await agentINFT.isAuthorized(1, user2.address)).to.be.false;
    });

    it("should reject non-owner authorization", async function () {
      const permissions = ethers.toUtf8Bytes("read");
      await expect(
        agentINFT.connect(user2).authorizeUsage(1, user2.address, permissions)
      ).to.be.revertedWith("Not owner");
    });
  });

  describe("Skill Management", function () {
    beforeEach(async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await agentINFT.mintAgent(user1.address, "uri", hash);
    });

    it("should equip and list skills", async function () {
      await agentINFT.connect(user1).equipSkill(1, "sentiment-v1");
      await agentINFT.connect(user1).equipSkill(1, "risk-scoring-v1");

      const skills = await agentINFT.getAgentSkills(1);
      expect(skills.length).to.equal(2);
      expect(skills[0]).to.equal("sentiment-v1");
      expect(skills[1]).to.equal("risk-scoring-v1");
    });

    it("should unequip skill", async function () {
      await agentINFT.connect(user1).equipSkill(1, "sentiment-v1");
      await agentINFT.connect(user1).equipSkill(1, "risk-scoring-v1");
      await agentINFT.connect(user1).unequipSkill(1, 0); // Remove first

      const skills = await agentINFT.getAgentSkills(1);
      expect(skills.length).to.equal(1);
      expect(skills[0]).to.equal("risk-scoring-v1");
    });
  });

  describe("Clone", function () {
    it("should clone an agent", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await agentINFT.mintAgent(user1.address, "uri", hash);

      const sealedKey = ethers.toUtf8Bytes("new-sealed-key");
      const proof = ethers.toUtf8Bytes("valid-proof-placeholder");

      await agentINFT.connect(user1).clone(user2.address, 1, sealedKey, proof);

      expect(await agentINFT.ownerOf(2)).to.equal(user2.address);
      const agent = await agentINFT.getAgent(2);
      expect(agent[3]).to.equal(1n); // clonedFrom = 1
    });
  });
});
