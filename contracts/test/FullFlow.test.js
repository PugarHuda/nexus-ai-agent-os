const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Full Integration Test
 * Tests the complete Nexus flow:
 * mint agent → create skill → equip skill → record reputation → create task → complete → release
 */
describe("Full Nexus Flow", function () {
  let agentINFT, skillRegistry, reputation, escrow, oracle;
  let owner, creator, user;

  before(async function () {
    [owner, creator, user] = await ethers.getSigners();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();

    const NexusAgentINFT = await ethers.getContractFactory("NexusAgentINFT");
    agentINFT = await NexusAgentINFT.deploy(await oracle.getAddress());

    const SkillRegistry = await ethers.getContractFactory("SkillRegistry");
    skillRegistry = await SkillRegistry.deploy(await oracle.getAddress());

    const ReputationEngine = await ethers.getContractFactory("ReputationEngine");
    reputation = await ReputationEngine.deploy();
    await reputation.addReporter(owner.address);

    const AgentEscrow = await ethers.getContractFactory("AgentEscrow");
    escrow = await AgentEscrow.deploy();
  });

  it("should complete the full Nexus lifecycle", async function () {
    // 1. Mint an agent
    const agentHash = ethers.keccak256(ethers.toUtf8Bytes("analyst-v1"));
    await agentINFT.mintAgent(creator.address, "0g://agent-analyst", agentHash);
    expect(await agentINFT.ownerOf(1)).to.equal(creator.address);

    // 2. Create a skill
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes("sentiment-v1"));
    await skillRegistry.connect(creator).createSkill(
      "Sentiment Analysis", "Analyzes sentiment",
      "0g://skill-sentiment", skillHash,
      ethers.parseEther("0.001"),
      ethers.parseEther("0.1")
    );
    expect(await skillRegistry.ownerOf(1)).to.equal(creator.address);

    // 3. Equip skill to agent
    await agentINFT.connect(creator).equipSkill(1, "sentiment-v1");
    const skills = await agentINFT.getAgentSkills(1);
    expect(skills).to.include("sentiment-v1");

    // 4. User pays for skill usage
    await skillRegistry.connect(user).payForUse(1, { value: ethers.parseEther("0.001") });
    expect(await skillRegistry.isAuthorizedUser(1, user.address)).to.be.true;

    // 5. Record reputation (simulating post-inference)
    const daHash = ethers.keccak256(ethers.toUtf8Bytes("action-proof-1"));
    await reputation.recordAction(1, 0, 8500, daHash); // accuracy: 85%
    await reputation.recordAction(1, 1, 9000, daHash); // reliability: 90%
    await reputation.recordAction(1, 2, 9200, daHash); // safety: 92%
    await reputation.recordAction(1, 3, 7500, daHash); // collaboration: 75%

    const compositeScore = await reputation.getCompositeScore(1);
    expect(compositeScore).to.be.gt(0);

    // 6. Create task with escrow
    await escrow.connect(user).createTask(
      1, creator.address, "Analyze BTC sentiment",
      { value: ethers.parseEther("0.5") }
    );

    // 7. Agent owner starts and completes task
    await escrow.connect(creator).startTask(1);
    const resultHash = ethers.keccak256(ethers.toUtf8Bytes("sentiment-result"));
    await escrow.connect(creator).completeTask(1, resultHash, daHash);

    // 8. User releases payment
    const balBefore = await ethers.provider.getBalance(creator.address);
    await escrow.connect(user).releasePayment(1);
    const balAfter = await ethers.provider.getBalance(creator.address);
    expect(balAfter).to.be.gt(balBefore);

    // 9. Verify final state
    const task = await escrow.getTask(1);
    expect(task.status).to.equal(5n); // Released

    const rep = await reputation.getReputation(1);
    expect(rep.totalActions).to.equal(4n);

    console.log("\n  ✅ Full Nexus lifecycle completed successfully!");
    console.log(`     Agent #1: ${skills.length} skills, composite score: ${compositeScore}`);
    console.log(`     Task #1: completed and payment released`);
  });

  it("should clone an agent with inherited skills", async function () {
    const sealedKey = ethers.toUtf8Bytes("clone-key");
    const proof = ethers.toUtf8Bytes("clone-proof");

    await agentINFT.connect(creator).clone(user.address, 1, sealedKey, proof);

    expect(await agentINFT.ownerOf(2)).to.equal(user.address);

    const clonedAgent = await agentINFT.getAgent(2);
    expect(clonedAgent[3]).to.equal(1n); // clonedFrom = 1

    // Clone inherits skills
    const clonedSkills = await agentINFT.getAgentSkills(2);
    expect(clonedSkills).to.include("sentiment-v1");

    console.log("  ✅ Agent cloned with inherited skills!");
  });

  it("should authorize usage (AI-as-a-Service)", async function () {
    const permissions = ethers.toUtf8Bytes(JSON.stringify({
      maxRequests: 100,
      expiresAt: Math.floor(Date.now() / 1000) + 86400,
      operations: ["inference", "skill_execution"],
    }));

    await agentINFT.connect(creator).authorizeUsage(1, user.address, permissions);
    expect(await agentINFT.isAuthorized(1, user.address)).to.be.true;

    // Revoke
    await agentINFT.connect(creator).revokeUsage(1, user.address);
    expect(await agentINFT.isAuthorized(1, user.address)).to.be.false;

    console.log("  ✅ AuthorizedUsage (AI-as-a-Service) working!");
  });
});
