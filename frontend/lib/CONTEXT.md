# frontend/lib/ — Utility Libraries

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
Shared utility modules for the Nexus frontend.

## Key Files
| File | Purpose |
|------|---------|
| `api.ts` | API client — wraps fetch calls to backend (localhost:3001). Handles agent CRUD, skill operations, task management, reputation queries. |
| `constants.ts` | Contract addresses, chain config, RPC URLs. Single source of truth for 0G network configuration. |
| `wallet.ts` | Wallet connection utilities — MetaMask integration, auto-add 0G Galileo Testnet, chain switching. |

## 0G Relevance
- `constants.ts` contains all 0G Galileo Testnet config (Chain ID: 16602, RPC, contract addresses)
- `wallet.ts` handles auto-adding the 0G network to MetaMask for judges/reviewers
- `api.ts` routes all requests through the backend which calls 0G SDKs
