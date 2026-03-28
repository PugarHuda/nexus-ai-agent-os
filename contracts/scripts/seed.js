/**
 * Seed demo data for Nexus
 *
 * Creates sample agents, skills, and reputation scores for demo purposes.
 * Run after deploy.js.
 */

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Load deployed contract addresses from env or hardcode after deploy
  const AGENT_ADDR = process.env.NEXUS_AGENT_CONTRACT;
  const SKILL_ADDR = process.env.SKILL_REGISTRY_CONTRACT;
  const REP_ADDR = process.env.REPUTATION_CONTRACT;

  if (!AGENT_ADDR || !SKILL_ADDR || !REP_ADDR) {
    console.error("Set contract addresses in .env first (run deploy.js)");
    process.exit(1);
  }

  const agentINFT = await ethers.getContractAt("NexusAgentINFT", AGENT_ADDR);
  const skillRegistry = await ethers.getContractAt("SkillRegistry", SKILL_ADDR);
  const reputation = await ethers.getContractAt("ReputationEngine", REP_ADDR);

  console.log("Seeding demo data...\n");

  // ─── Mint Sample Agents ────────────────────────────────
  const agents = [
    { name: "Nexus Analyst", uri: "0g://agent-analyst-v1" },
    { name: "Nexus Coder", uri: "0g://agent-coder-v1" },
    { name: "Nexus Coordinator", uri: "0g://agent-coordinator-v1" },
  ];

  for (const agent of agents) {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(agent.name));
    const tx = await agentINFT.mintAgent(deployer.address, agent.uri, hash);
    const receipt = await tx.wait();
    console.log(`  ✓ Minted agent: ${agent.name}`);
  }

  // ─── Create Sample Skills ──────────────────────────────
  const skills = [
    { name: "Sentiment Analysis", desc: "Analyzes text sentiment with crypto context", price: "0.001", sub: "0.1" },
    { name: "Risk Scoring", desc: "Evaluates DeFi protocol risk levels", price: "0.005", sub: "0.5" },
    { name: "Code Review", desc: "Automated Solidity code review", price: "0.01", sub: "1.0" },
  ];

  for (const skill of skills) {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(skill.name));
    const tx = await skillRegistry.createSkill(
      skill.name,
      skill.desc,
      `0g://skill-${skill.name.toLowerCase().replace(/ /g, "-")}`,
      hash,
      ethers.parseEther(skill.price),
      ethers.parseEther(skill.sub)
    );
    await tx.wait();
    console.log(`  ✓ Created skill: ${skill.name}`);
  }

  // ─── Equip Skills to Agents ────────────────────────────
  await (await agentINFT.equipSkill(1, "sentiment-v1")).wait();
  await (await agentINFT.equipSkill(1, "risk-scoring-v1")).wait();
  await (await agentINFT.equipSkill(2, "code-review-v1")).wait();
  console.log("  ✓ Equipped skills to agents");

  // ─── Set Initial Reputation ────────────────────────────
  const daHash = ethers.keccak256(ethers.toUtf8Bytes("seed-proof"));

  // Agent 1 (Analyst): high accuracy, high safety
  await (await reputation.recordAction(1, 0, 8500, daHash)).wait(); // accuracy
  await (await reputation.recordAction(1, 1, 9000, daHash)).wait(); // reliability
  await (await reputation.recordAction(1, 2, 9200, daHash)).wait(); // safety
  await (await reputation.recordAction(1, 3, 7500, daHash)).wait(); // collaboration

  // Agent 2 (Coder): high accuracy, moderate collaboration
  await (await reputation.recordAction(2, 0, 9000, daHash)).wait();
  await (await reputation.recordAction(2, 1, 8800, daHash)).wait();
  await (await reputation.recordAction(2, 2, 9500, daHash)).wait();
  await (await reputation.recordAction(2, 3, 6000, daHash)).wait();

  // Agent 3 (Coordinator): balanced
  await (await reputation.recordAction(3, 0, 7800, daHash)).wait();
  await (await reputation.recordAction(3, 1, 8500, daHash)).wait();
  await (await reputation.recordAction(3, 2, 8800, daHash)).wait();
  await (await reputation.recordAction(3, 3, 9000, daHash)).wait();

  console.log("  ✓ Set initial reputation scores\n");

  console.log("═══════════════════════════════════════════");
  console.log("  Seed Complete!");
  console.log("  3 agents minted, 3 skills created,");
  console.log("  skills equipped, reputation initialized.");
  console.log("═══════════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
