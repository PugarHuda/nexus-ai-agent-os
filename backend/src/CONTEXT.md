# backend/src/ — Source Code Overview

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Storage, Compute, DA, Chain, AI Alignment

## What This Folder Contains
TypeScript source code for the Nexus backend API server (Express.js).

## Structure
| Path | Purpose |
|------|---------|
| `index.ts` | Entry point — Express server setup, middleware, route mounting |
| `api/` | REST API route definitions |
| `services/` | 0G SDK integrations (Storage, Compute, DA, contracts, reputation, safety) |
| `types/` | TypeScript type definitions and SDK declarations |

## 0G Relevance
This is where all 0G SDK calls happen. Each service file wraps a specific 0G component:
- `storage.ts` → @0gfoundation/0g-ts-sdk (upload/download encrypted metadata)
- `compute.ts` → @0glabs/0g-serving-broker (TeeML inference)
- `da.ts` → 0G DA (action proof posting)
- `contracts.ts` → ethers.js + 0G Chain (contract reads/writes)
- `safety.ts` → AI Alignment monitoring

## Commands
```bash
cd backend && npm run dev    # Start dev server on port 3001
cd backend && npm run build  # Compile TypeScript
```
