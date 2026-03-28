/**
 * Verify all Nexus contracts on 0G Explorer
 *
 * Run after deploy.js. Requires contract addresses in env.
 * Usage: npx hardhat run scripts/verify.js --network og-mainnet
 */

const { run } = require("hardhat");

async function verify(name, address, args = []) {
  console.log(`Verifying ${name} at ${address}...`);
  try {
    await run("verify:verify", { address, constructorArguments: args });
    console.log(`  ✓ ${name} verified`);
  } catch (err) {
    if (err.message.includes("Already Verified")) {
      console.log(`  ✓ ${name} already verified`);
    } else {
      console.log(`  ✗ ${name} verification failed: ${err.message}`);
    }
  }
}

async function main() {
  const ORACLE = process.env.ORACLE_CONTRACT;
  const AGENT = process.env.NEXUS_AGENT_CONTRACT;
  const SKILL = process.env.SKILL_REGISTRY_CONTRACT;
  const REP = process.env.REPUTATION_CONTRACT;
  const ESCROW = process.env.ESCROW_CONTRACT;

  if (!AGENT) {
    console.error("Set contract addresses in .env first");
    process.exit(1);
  }

  await verify("MockOracle", ORACLE);
  await verify("NexusAgentINFT", AGENT, [ORACLE]);
  await verify("SkillRegistry", SKILL, [ORACLE]);
  await verify("ReputationEngine", REP);
  await verify("AgentEscrow", ESCROW);

  console.log("\nAll contracts verified on 0G Explorer!");
}

main().catch(console.error);
