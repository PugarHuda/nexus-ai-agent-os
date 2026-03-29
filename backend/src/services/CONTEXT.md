# backend/src/services/ — 0G SDK Service Integrations

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Storage, Compute, DA, Chain, AI Alignment

## What This Folder Contains
Service modules that wrap each 0G component SDK. This is the core integration layer.

## Key Files
| File | 0G Component | SDK |
|------|-------------|-----|
| `storage.ts` | 0G Storage | @0gfoundation/0g-ts-sdk — upload/download encrypted agent metadata, skill weights, memory |
| `compute.ts` | 0G Compute | @0glabs/0g-serving-broker — TeeML-verified AI inference |
| `da.ts` | 0G DA | 0G DA SDK — post action proofs for reputation audit trail |
| `contracts.ts` | 0G Chain | ethers.js — interact with deployed smart contracts |
| `reputation.ts` | Reputation | Scoring logic — 4 dimensions (accuracy, reliability, safety, collaboration) |
| `safety.ts` | AI Alignment | Safety monitoring — drift detection, content filtering |

## 0G Relevance
This folder is the deepest 0G integration point. Judges evaluating "0G Integration Depth" will focus here. Each file demonstrates real SDK usage against the 0G Galileo Testnet.

## Key Integration Details
- Storage: Log Layer (immutable history) + KV Layer (working state)
- Compute: TeeML verification ensures inference integrity
- DA: Action proofs are hashed and posted for auditability
