# test/ — Test Suites

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **Judging:** 0G Integration Depth, Technical Completeness, Product Value, UX/Demo Quality, Documentation

## Konteks untuk AI Collaborator

Folder ini berisi test suites untuk smart contracts dan backend services.

## Structure

```
test/
├── contracts/
│   ├── NexusAgentINFT.test.js  — Test mint, transfer, clone, authorizeUsage
│   ├── SkillRegistry.test.js   — Test create, payForUse, subscribe
│   ├── ReputationEngine.test.js — Test recordAction, getCompositeScore
│   └── AgentEscrow.test.js     — Test createTask, complete, dispute, release
├── integration/
│   ├── storage.test.ts         — Test 0G Storage upload/download
│   ├── compute.test.ts         — Test 0G Compute inference
│   └── full-flow.test.ts       — End-to-end: mint → equip → infer → reputation
└── CONTEXT.md
```

## Testing Framework
- Smart contracts: Hardhat + Chai + ethers.js
- Backend: Jest + supertest
- Run: `cd contracts && npx hardhat test`

## Key Test Scenarios
1. Mint agent → verify INFT exists → check metadata hash
2. Create skill → pay for use → verify authorization
3. Clone agent → verify new INFT has same metadata
4. AuthorizeUsage → verify executor can access
5. Record action → verify reputation updated
6. Create task → complete → release payment
7. Create task → complete → dispute → resolve
8. Full flow: mint agent → equip skill → run inference → update reputation
