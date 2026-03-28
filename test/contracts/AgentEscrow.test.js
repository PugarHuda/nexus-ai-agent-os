const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AgentEscrow", function () {
  let escrow, owner, requester, agentOwner;

  beforeEach(async function () {
    [owner, requester, agentOwner] = await ethers.getSigners();

    const AgentEscrow = await ethers.getContractFactory("AgentEscrow");
    escrow = await AgentEscrow.deploy();
  });

  describe("Task Creation", function () {
    it("should create task with locked payment", async function () {
      const payment = ethers.parseEther("1.0");

      await escrow.connect(requester).createTask(
        1, // agentId
        agentOwner.address,
        "Analyze market trends",
        { value: payment }
      );

      const task = await escrow.getTask(1);
      expect(task.requester).to.equal(requester.address);
      expect(task.agentId).to.equal(1n);
      expect(task.payment).to.equal(payment);
      expect(task.status).to.equal(0n); // Created
    });

    it("should reject zero payment", async function () {
      await expect(
        escrow.connect(requester).createTask(1, agentOwner.address, "test", { value: 0 })
      ).to.be.revertedWith("Payment required");
    });
  });

  describe("Task Lifecycle", function () {
    const payment = ethers.parseEther("1.0");

    beforeEach(async function () {
      await escrow.connect(requester).createTask(
        1, agentOwner.address, "Analyze market", { value: payment }
      );
    });

    it("should complete full lifecycle: create → start → complete → release", async function () {
      // Start
      await escrow.connect(agentOwner).startTask(1);
      let task = await escrow.getTask(1);
      expect(task.status).to.equal(1n); // InProgress

      // Complete
      const resultHash = ethers.keccak256(ethers.toUtf8Bytes("result"));
      const daHash = ethers.keccak256(ethers.toUtf8Bytes("da-proof"));
      await escrow.connect(agentOwner).completeTask(1, resultHash, daHash);
      task = await escrow.getTask(1);
      expect(task.status).to.equal(2n); // Completed

      // Release by requester
      const balBefore = await ethers.provider.getBalance(agentOwner.address);
      await escrow.connect(requester).releasePayment(1);
      const balAfter = await ethers.provider.getBalance(agentOwner.address);

      task = await escrow.getTask(1);
      expect(task.status).to.equal(5n); // Released

      // Agent owner received payment minus 3% fee
      const expectedPayout = payment - (payment * 3n) / 100n;
      expect(balAfter - balBefore).to.equal(expectedPayout);
    });

    it("should auto-release after dispute period", async function () {
      await escrow.connect(agentOwner).startTask(1);

      const resultHash = ethers.keccak256(ethers.toUtf8Bytes("result"));
      const daHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));
      await escrow.connect(agentOwner).completeTask(1, resultHash, daHash);

      // Fast forward past dispute period (3 days)
      await time.increase(3 * 24 * 60 * 60 + 1);

      // Anyone can release after dispute period
      await escrow.connect(owner).releasePayment(1);
      const task = await escrow.getTask(1);
      expect(task.status).to.equal(5n); // Released
    });
  });

  describe("Disputes", function () {
    const payment = ethers.parseEther("1.0");

    beforeEach(async function () {
      await escrow.connect(requester).createTask(
        1, agentOwner.address, "task", { value: payment }
      );
      await escrow.connect(agentOwner).startTask(1);
      const hash = ethers.keccak256(ethers.toUtf8Bytes("x"));
      await escrow.connect(agentOwner).completeTask(1, hash, hash);
    });

    it("should allow requester to dispute", async function () {
      await escrow.connect(requester).disputeTask(1);
      const task = await escrow.getTask(1);
      expect(task.status).to.equal(3n); // Disputed
    });

    it("should resolve dispute with refund", async function () {
      await escrow.connect(requester).disputeTask(1);

      const balBefore = await ethers.provider.getBalance(requester.address);
      await escrow.connect(owner).resolveDispute(1, true); // refund
      const balAfter = await ethers.provider.getBalance(requester.address);

      expect(balAfter).to.be.gt(balBefore);
      const task = await escrow.getTask(1);
      expect(task.status).to.equal(4n); // Refunded
    });

    it("should reject dispute after deadline", async function () {
      await time.increase(3 * 24 * 60 * 60 + 1);
      await expect(
        escrow.connect(requester).disputeTask(1)
      ).to.be.revertedWith("Dispute period ended");
    });
  });
});
