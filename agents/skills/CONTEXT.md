# agents/skills/ — Skill Modules Overview

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Compute (TeeML inference), Storage (skill weights), Chain (SkillRegistry)

## What This Folder Contains
OpenClaw-compatible skill modules that agents can equip. Each skill is a self-contained module with manifest, prompt, and handler.

## Skill Modules
| Folder | Skill | Description |
|--------|-------|-------------|
| `sentiment/` | Sentiment Analysis | Analyzes text sentiment — positive/negative/neutral scoring |
| `risk-scoring/` | Risk Assessment | Evaluates risk levels for financial/operational decisions |
| `code-review/` | Code Review | Automated code review — bug detection, style, security |

## Skill Module Format
Each skill folder contains:
- `manifest.json` — Name, description, input/output schema, pricing model
- `prompt.md` — System prompt template for the skill
- `handler.ts` — Execution handler that calls 0G Compute for inference

## 0G Relevance
- Skills are minted as INFTs on SkillRegistry (0G Chain)
- Skill weights stored encrypted on 0G Storage
- Inference runs via 0G Compute with TeeML verification
- Skills can be bought, subscribed to, or licensed via authorizeUsage
