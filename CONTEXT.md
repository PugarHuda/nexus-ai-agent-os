# Nexus — Project Root

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Prize Pool:** $150,000 USD (1st: $45K, 2nd: $35K, 3rd: $20K)
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Chain, Storage, Compute, DA, Agent ID (ERC-7857), AI Alignment
- **Judging:** 0G Integration Depth, Technical Completeness, Product Value, UX/Demo Quality, Documentation

## What is Nexus?
Decentralized AI Agent Operating System built on 0G. Agents are born (INFT), learn skills (OpenClaw), build reputation (DA), execute tasks (Compute+TeeML), and get monetized (Escrow) — all on-chain.

## Folder Structure
| Folder | Purpose |
|--------|---------|
| `contracts/` | Solidity smart contracts (ERC-7857 INFT, SkillRegistry, ReputationEngine, AgentEscrow) |
| `backend/` | TypeScript API server + 0G SDK integrations (Storage, Compute, DA) |
| `frontend/` | Next.js 14 dashboard (7 pages, wallet integration) |
| `agents/` | OpenClaw agent definitions + 3 skill modules + orchestrator |
| `scripts/` | Root-level deploy, seed, verify scripts |
| `docs/` | Architecture, API reference, 0G integration guide, demo script |
| `test/` | Additional test suites (contract + integration) |

## Quick Commands
```bash
cd contracts && npx hardhat test          # Run 29 contract tests
cd backend && npm run dev                 # Start API server (port 3001)
cd frontend && npm run dev                # Start dashboard (port 3000)
cd contracts && npx hardhat run scripts/deploy.js --network og-testnet
```
