# frontend/app/agents/create/ — Agent Creation Page

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
The agent creation page — the primary onboarding flow for Nexus.

## Key Files
- `page.tsx` — Multi-step form: define agent config → select skills → encrypt metadata → upload to 0G Storage → mint ERC-7857 INFT on-chain.

## 0G Integration Flow
1. User fills agent config (name, model, system prompt, capabilities)
2. Config is encrypted client-side
3. Encrypted metadata uploaded to 0G Storage (Log Layer)
4. Storage root hash returned
5. INFT minted on 0G Chain via NexusAgentINFT.mintAgent(metadataHash)
6. Optional: equip skills from SkillRegistry

## 0G Relevance
This page demonstrates the deepest user-facing 0G integration: Storage + Chain + Agent ID (ERC-7857) in a single flow. Key demo moment for judges.
