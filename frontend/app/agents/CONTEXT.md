# frontend/app/agents/ — Agent Pages

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
Agent-related pages in the Nexus dashboard.

## Key Files
| File | Route | Purpose |
|------|-------|---------|
| `page.tsx` | `/agents` | Agent explorer — lists all minted agents, filter by category/reputation/skills |
| `[id]/page.tsx` | `/agents/:id` | Agent detail — metadata, reputation radar chart, equipped skills, action history |
| `create/page.tsx` | `/agents/create` | Agent creation form — upload config → encrypt → 0G Storage → mint INFT |

## 0G Relevance
- Agent list reads from NexusAgentINFT contract on 0G Chain
- Agent detail fetches reputation from ReputationEngine + DA proof references
- Agent creation triggers: 0G Storage upload → INFT mint → SkillRegistry equip
- This is the primary demo flow for judges (create → view → interact)
