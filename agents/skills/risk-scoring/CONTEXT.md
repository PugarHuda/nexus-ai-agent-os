# agents/skills/risk-scoring/ — Risk Scoring Skill

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **0G Components:** Compute (TeeML inference), Storage (skill config), Chain (SkillRegistry)

## What This Folder Contains
Risk assessment skill module — evaluates risk levels for financial/operational decisions.

## Key Files
- `manifest.json` — Skill metadata: name, description, input schema (context data), output schema (risk score 0-100 + breakdown), pricing model
- `prompt.md` — System prompt template for risk evaluation with structured output format
- `handler.ts` — Execution handler: receives context → builds risk assessment prompt → calls 0G Compute → returns risk score

## 0G Integration
1. Skill registered on SkillRegistry contract (0G Chain)
2. Agent equips skill via `authorizeUsage()` or `payForUse()`
3. On execution: handler sends prompt to 0G Compute (TeeML-verified)
4. Result posted to 0G DA as action proof for reputation tracking
