# agents/definitions/ — Agent JSON Definitions

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
JSON configuration files defining each Nexus agent's capabilities, model, and system prompt.

## Key Files
| File | Agent | Role |
|------|-------|------|
| `analyst.json` | Analyst Agent | Data/market analysis specialist — sentiment analysis, risk assessment |
| `coder.json` | Coder Agent | Code review/generation specialist — automated code review, bug detection |
| `coordinator.json` | Coordinator Agent | Meta-agent that orchestrates other agents for complex multi-step tasks |

## Config Format
Each JSON defines: name, description, model (for 0G Compute), system prompt, capabilities list, and default skill loadout.

## 0G Relevance
These configs are encrypted and stored on 0G Storage, then minted as ERC-7857 INFTs. The encrypted metadata is the "soul" of each agent — transferable, clonable, and licensable via authorizeUsage.

## Usage
Configs are loaded by `orchestrator.ts` and used during agent creation (seed script) and runtime inference.
