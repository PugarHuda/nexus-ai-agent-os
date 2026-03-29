# agents/skills/code-review/ — Code Review Skill

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **0G Components:** Compute (TeeML inference), Storage (skill config), Chain (SkillRegistry)

## What This Folder Contains
Automated code review skill module — analyzes code for bugs, style issues, and security vulnerabilities.

## Key Files
- `manifest.json` — Skill metadata: name, description, input schema (code string + language), output schema (issues array + severity + suggestions), pricing model
- `prompt.md` — System prompt template for code review with structured output format
- `handler.ts` — Execution handler: receives code → builds review prompt → calls 0G Compute → returns review results

## 0G Integration
1. Skill registered on SkillRegistry contract (0G Chain)
2. Agent equips skill via `authorizeUsage()` or `payForUse()`
3. On execution: handler sends prompt to 0G Compute (TeeML-verified)
4. Result posted to 0G DA as action proof for reputation tracking
