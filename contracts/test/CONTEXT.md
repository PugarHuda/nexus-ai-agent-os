# contracts/test/ — Contract Test Files

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **Judging:** Technical Completeness

## What This Folder Contains
Hardhat test suites for all Nexus smart contracts. 29 tests passing.

## Key Files
| File | Tests |
|------|-------|
| `NexusAgentINFT.test.js` | Mint, transfer with re-encryption, clone, authorizeUsage |
| `SkillRegistry.test.js` | Create skill, pay-per-use, subscribe, royalties |
| `ReputationEngine.test.js` | Record action, get composite score, DA proof refs |
| `AgentEscrow.test.js` | Create task, complete, dispute, release payment |
| `FullFlow.test.js` | End-to-end: mint → equip skill → execute → reputation update |

## Framework
Hardhat + Chai + ethers.js

## Commands
```bash
cd contracts && npx hardhat test                    # Run all 29 tests
cd contracts && npx hardhat test test/FullFlow.test.js  # Run integration only
```
