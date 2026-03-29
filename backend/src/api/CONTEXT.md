# backend/src/api/ — REST API Routes

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
Express.js REST API route definitions for the Nexus backend.

## Key Files
- `routes.ts` — All API endpoints. Connects frontend requests to 0G service layer.

## API Endpoints (key routes)
- `POST /agents` — Create agent (encrypt metadata → 0G Storage → mint INFT)
- `GET /agents` — List agents (read from chain)
- `GET /agents/:id` — Agent detail + reputation
- `POST /agents/:id/interact` — Send message to agent (0G Compute inference)
- `POST /skills` — Create skill
- `GET /skills` — List skills
- `POST /tasks` — Create task with escrow
- `POST /tasks/:id/complete` — Complete task
- `GET /reputation/:agentId` — Get reputation scores

## 0G Relevance
Every endpoint triggers one or more 0G SDK calls via the services layer. The API is the bridge between the Next.js frontend and on-chain/off-chain 0G infrastructure.
