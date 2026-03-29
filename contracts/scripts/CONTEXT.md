# contracts/scripts/ — Deploy, Seed & Verify Scripts

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **Judging:** Technical Completeness, UX/Demo Quality

## What This Folder Contains
Hardhat scripts for deploying, seeding, and verifying Nexus smart contracts.

## Key Files
| File | Purpose |
|------|---------|
| `deploy.js` | Deploy all 4 contracts + MockOracle in correct order, set cross-references |
| `seed.js` | Seed demo data — 3 sample agents, 3 skills, initial reputation scores |
| `verify.js` | Verify contracts on 0G Explorer for source code transparency |
| `verify-0g-integration.js` | Verify all 6 0G components are live and connected |
| `check-balance.js` | Check deployer wallet balance on 0G network |

## Commands
```bash
npx hardhat run scripts/deploy.js --network og-testnet
npx hardhat run scripts/seed.js --network og-testnet
npx hardhat run scripts/verify-0g-integration.js --network og-testnet
```

## Deploy Order
MockOracle → NexusAgentINFT → SkillRegistry → ReputationEngine → AgentEscrow
