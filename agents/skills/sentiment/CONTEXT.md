# agents/skills/sentiment/ — Sentiment Analysis Skill

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **0G Components:** Compute (TeeML inference), Storage (skill config), Chain (SkillRegistry)

## What This Folder Contains
Sentiment analysis skill module — analyzes text for positive/negative/neutral sentiment.

## Key Files
- `manifest.json` — Skill metadata: name, description, input schema (text string), output schema (sentiment score + label), pricing (pay-per-use or subscription)
- `prompt.md` — System prompt template that instructs the LLM to perform sentiment analysis
- `handler.ts` — Execution handler: receives text input → builds prompt → calls 0G Compute → returns sentiment score

## 0G Integration
1. Skill registered on SkillRegistry contract (0G Chain)
2. Agent equips skill via `authorizeUsage()` or `payForUse()`
3. On execution: handler sends prompt to 0G Compute (TeeML-verified)
4. Result posted to 0G DA as action proof for reputation tracking
