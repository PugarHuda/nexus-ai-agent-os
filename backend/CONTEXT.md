# backend/ — Backend Services

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Live URL:** https://backend-inky-theta-62.vercel.app
- **Deployed on:** Vercel (serverless)
- **All endpoints read from on-chain** — no mockups

## Konteks untuk AI Collaborator

Backend Nexus menangani semua interaksi antara smart contracts, 0G Storage, 0G Compute, 0G DA, dan OpenClaw agent orchestration.

## Arsitektur

```
backend/
├── src/
│   ├── services/
│   │   ├── storage.ts      — 0G Storage integration (upload/download encrypted metadata)
│   │   ├── compute.ts      — 0G Compute integration (AI inference via TeeML)
│   │   ├── da.ts           — 0G DA integration (post action proofs)
│   │   ├── contracts.ts    — Smart contract interaction layer
│   │   ├── reputation.ts   — Reputation scoring logic
│   │   └── safety.ts       — AI safety monitoring (Alignment Node concept)
│   ├── agents/
│   │   ├── orchestrator.ts — OpenClaw agent orchestration
│   │   └── skills/         — Skill execution handlers
│   ├── api/
│   │   └── routes.ts       — REST API endpoints
│   └── index.ts            — Entry point
├── package.json
└── tsconfig.json
```

## Teknologi
- TypeScript + Node.js
- @0gfoundation/0g-ts-sdk — Storage SDK
- python-0g — Compute SDK (Python sidecar)
- ethers.js — Contract interaction
- Express.js — API server

## 0G Integration Points

### 0G Storage (@0gfoundation/0g-ts-sdk)
- Upload encrypted agent metadata (model weights, config)
- Upload encrypted skill weights
- Store agent memory (Log Layer = immutable history, KV Layer = working state)
- Download metadata for inference

### 0G Compute
- Run AI inference via TeeML-verified providers
- Available models on mainnet:
  - DeepSeek Chat V3 (0.30/1.00 0G per 1M tokens)
  - GPT-OSS-120B (0.10/0.49 0G per 1M tokens)
  - Qwen3 VL 30B (0.49/0.49 0G per 1M tokens)
  - Whisper Large V3 (speech-to-text)
  - Z-Image (text-to-image)
- SDK: @0glabs/0g-serving-broker

### 0G DA
- Post action proofs (hash of agent decisions + outcomes)
- Used by ReputationEngine to verify scores
- Immutable audit trail

### OpenClaw
- Multi-agent orchestration framework
- Skills are OpenClaw "skills" that can be composed
- Agent communication via shared SQLite queue + Markdown interchange

## Environment Variables
```
OG_RPC_URL=https://evmrpc.0g.ai
OG_STORAGE_INDEXER=https://indexer-storage-turbo.0g.ai
OG_COMPUTE_URL=https://compute-marketplace.0g.ai
PRIVATE_KEY=deployer_private_key
NEXUS_AGENT_CONTRACT=deployed_address
SKILL_REGISTRY_CONTRACT=deployed_address
REPUTATION_CONTRACT=deployed_address
ESCROW_CONTRACT=deployed_address
```

## Mainnet Contract Addresses (0G)
- Flow (Storage): 0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526
- Mine (Storage): 0xCd01c5Cd953971CE4C2c9bFb95610236a7F414fe
- Reward (Storage): 0x457aC76B58ffcDc118AABD6DbC63ff9072880870
