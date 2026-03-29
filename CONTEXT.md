# Nexus — Project Root

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Prize Pool:** $150,000 USD (1st: $45K, 2nd: $35K, 3rd: $20K)
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **Judging:** 0G Integration Depth, Technical Completeness, Product Value, UX/Demo Quality, Documentation

## Live Deployment
- **Frontend:** https://frontend-pi-one-48.vercel.app
- **Backend API:** https://backend-inky-theta-62.vercel.app
- **GitHub:** https://github.com/PugarHuda/nexus-ai-agent-os
- **Explorer:** https://chainscan-galileo.0g.ai

## Deployed Contracts (Galileo Testnet)
- NexusAgentINFT: `0x0e8e941c363dc1C06DD0bC02395B775dE94B48a4`
- SkillRegistry: `0xF24C4B0f45a46E2d761770BA75e147DEb738d3A6`
- ReputationEngine: `0x465291f35A3DC723B81349CBeBB296Cbf57AAAa3`
- AgentEscrow: `0x66f6f49B80d4F705AB1b8Fe8E6b2cA51846EBDE8`

## What is Nexus?
Decentralized AI Agent Operating System built on 0G. Agents are born (INFT), learn skills (OpenClaw), build reputation (DA), execute tasks (Compute+TeeML), and get monetized (Escrow) — all on-chain.

## Mascot
**Nex** — a pixel robot fox. Orange fur (fox intelligence) + indigo mech body (machine precision) + green LED eyes (0G verification). 24x24 pixel art with 3 variants: idle, wave, think.

## 0G Components Used (ALL 6)
1. **0G Chain** — 4 smart contracts deployed
2. **0G Storage** — Agent metadata + skill weights (via @0gfoundation/0g-ts-sdk)
3. **0G Compute** — TeeML-verified inference (via @0glabs/0g-serving-broker)
4. **0G DA** — Action proofs posted via Storage Log Layer
5. **Agent ID (ERC-7857)** — INFT with clone, authorizeUsage, secureTransfer
6. **AI Alignment** — Safety monitoring service with drift detection

## Folder Structure
| Folder | Purpose |
|--------|---------|
| `contracts/` | 4 Solidity contracts + interfaces + mocks + tests (29 passing) |
| `backend/` | TypeScript Express API + 0G SDK integrations (Storage, Compute, DA) |
| `frontend/` | Next.js 14 pixel dashboard (8 pages, Nex mascot, 3D hero) |
| `agents/` | OpenClaw agent definitions + 3 skill modules + orchestrator |
| `scripts/` | Deploy, seed, verify scripts |
| `docs/` | Architecture, API reference, 0G integration guide, demo script |
| `test/` | Additional test suites |

## Quick Commands
```bash
cd contracts && npx hardhat test          # 29 contract tests
cd contracts && npx hardhat run scripts/verify-0g-integration.js --network og-testnet
cd backend && npm run dev                 # API server (port 3001)
cd frontend && npm run dev                # Dashboard (port 3000)
```
