/**
 * Deploy all Nexus contracts to 0G Chain
 *
 * Order:
 * 1. MockOracle (for testing; replace with TEE oracle in production)
 * 2. NexusAgentINFT (agent identity)
 * 3. SkillRegistry (skill marketplace)
 * 4. ReputationEngine (on-chain reputation)
 * 5. AgentEscrow (trustless task escrow)
 *
 * After deploy: set cross-references between contracts
 */

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("═══════════════════════════════════════════");
  console.log("  Nexus — Deploying to 0G Chain");
  console.log("═══════════════════════════════════════════");
  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  Balance:  ${ethers.formatEther(balance)} 0G`);
  console.log(`  Network:  ${(await ethers.provider.getNetwork()).chainId}`);
  console.log("═══════════════════════════════════════════\n");

  // 1. Deploy MockOracle
  console.log("1/5 Deploying MockOracle...");
  const MockOracle = await ethers.getContractFactory("MockOracle");
  const oracle = await MockOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  console.log(`    ✓ MockOracle: ${oracleAddr}\n`);

  // 2. Deploy NexusAgentINFT
  console.log("2/5 Deploying NexusAgentINFT...");
  const NexusAgentINFT = await ethers.getContractFactory("NexusAgentINFT");
  const agentINFT = await NexusAgentINFT.deploy(oracleAddr);
  await agentINFT.waitForDeployment();
  const agentAddr = await agentINFT.getAddress();
  console.log(`    ✓ NexusAgentINFT: ${agentAddr}\n`);

  // 3. Deploy SkillRegistry
  console.log("3/5 Deploying SkillRegistry...");
  const SkillRegistry = await ethers.getContractFactory("SkillRegistry");
  const skillRegistry = await SkillRegistry.deploy(oracleAddr);
  await skillRegistry.waitForDeployment();
  const skillAddr = await skillRegistry.getAddress();
  console.log(`    ✓ SkillRegistry: ${skillAddr}\n`);

  // 4. Deploy ReputationEngine
  console.log("4/5 Deploying ReputationEngine...");
  const ReputationEngine = await ethers.getContractFactory("ReputationEngine");
  const reputation = await ReputationEngine.deploy();
  await reputation.waitForDeployment();
  const repAddr = await reputation.getAddress();
  console.log(`    ✓ ReputationEngine: ${repAddr}\n`);

  // 5. Deploy AgentEscrow
  console.log("5/5 Deploying AgentEscrow...");
  const AgentEscrow = await ethers.getContractFactory("AgentEscrow");
  const escrow = await AgentEscrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log(`    ✓ AgentEscrow: ${escrowAddr}\n`);

  // Cross-references: add backend as reputation reporter
  console.log("Setting up cross-references...");
  const tx = await reputation.addReporter(deployer.address);
  await tx.wait();
  console.log("    ✓ Deployer added as reputation reporter\n");

  // Summary
  console.log("═══════════════════════════════════════════");
  console.log("  Deployment Complete!");
  console.log("═══════════════════════════════════════════");
  console.log(`  MockOracle:       ${oracleAddr}`);
  console.log(`  NexusAgentINFT:   ${agentAddr}`);
  console.log(`  SkillRegistry:    ${skillAddr}`);
  console.log(`  ReputationEngine: ${repAddr}`);
  console.log(`  AgentEscrow:      ${escrowAddr}`);
  console.log("═══════════════════════════════════════════");
  console.log("\nAdd to .env:");
  console.log(`NEXUS_AGENT_CONTRACT=${agentAddr}`);
  console.log(`SKILL_REGISTRY_CONTRACT=${skillAddr}`);
  console.log(`REPUTATION_CONTRACT=${repAddr}`);
  console.log(`ESCROW_CONTRACT=${escrowAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
