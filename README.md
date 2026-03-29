# Nexus — Decentralized AI Agent Operating System

> Built on 0G Infrastructure | Track 1: Agentic Infrastructure & OpenClaw Lab
> 0G APAC Hackathon 2026

## 🦊 Meet Nex

Nex is our pixel robot fox mascot — part organic intelligence, part machine precision. Every agent born in Nexus carries Nex's spirit: autonomous, verifiable, and unstoppable.

## Live Demo

| | |
|---|---|
| **Frontend** | https://frontend-pi-one-48.vercel.app |
| **Backend API** | https://backend-inky-theta-62.vercel.app |
| **GitHub** | https://github.com/PugarHuda/nexus-ai-agent-os |
| **0G Explorer** | https://chainscan-galileo.0g.ai |

### Deployed Contracts (0G Galileo Testnet)

| Contract | Address |
|----------|---------|
| NexusAgentINFT | `0x0e8e941c363dc1C06DD0bC02395B775dE94B48a4` |
| SkillRegistry | `0xF24C4B0f45a46E2d761770BA75e147DEb738d3A6` |
| ReputationEngine | `0x465291f35A3DC723B81349CBeBB296Cbf57AAAa3` |
| AgentEscrow | `0x66f6f49B80d4F705AB1b8Fe8E6b2cA51846EBDE8` |

On-chain data: 3 agents minted, 3 skills registered, reputation scores live.

## Hackathon

| | |
|---|---|
| **Event** | 0G APAC Hackathon 2026 |
| **Track** | Track 1 — Agentic Infrastructure & OpenClaw Lab |
| **Prize Pool** | $150,000 USD (1st: $45K, 2nd: $35K, 3rd: $20K) |
| **Deadline** | May 9, 2026, 23:59 UTC+8 |
| **Network** | 0G Galileo Testnet (Chain ID: 16602) |

### Judging Criteria
1. **0G Integration Depth** — Uses ALL 6 core 0G components
2. **Technical Completeness** — 4 contracts, full backend, 8-page frontend, 29 tests
3. **Product Value** — Agent OS = infrastructure play with network effects
4. **UX/Demo Quality** — Pixel art UI, 3D hero, Nex mascot, on-chain data
5. **Documentation** — Architecture docs, API reference, CONTEXT.md in every folder

📋 [Submission Checklist](docs/submission-checklist.md)

## What is Nexus?

Nexus is the OS layer for AI agents on 0G — where agents are born, learn, collaborate, build reputation, and get monetized. It unifies all 6 core 0G components into a single composable platform.

**Problem:** AI agents in Web3 are fragmented. No way for agents to have verifiable identity, share skills, build reputation, or collaborate trustlessly.

**Solution:** Nexus provides 6 layers — Identity (INFT), Skill Composition (OpenClaw), Memory (0G Storage), Execution (0G Compute + TeeML), Reputation (0G DA), and Safety (AI Alignment).

## 0G Components Used

| Component | Usage | Layer | SDK |
|-----------|-------|-------|-----|
| **0G Chain** | Smart contracts, on-chain reputation, escrow | L1, L5 | ethers.js |
| **0G Storage** | Agent memory (Log + KV), encrypted metadata | L3 | @0gfoundation/0g-ts-sdk |
| **0G Compute** | AI inference with TeeML verification | L4 | @0glabs/0g-serving-broker |
| **0G DA** | Action proof posting for auditability | L5 | via Storage Log Layer |
| **Agent ID (ERC-7857)** | Agent identity, skill INFTs, clone, authorizeUsage | L1, L2 | Solidity |
| **AI Alignment** | Safety monitoring, drift detection | L6 | Custom service |

## Architecture

```
┌─────────────────────────────────────────────────┐
│              NEXUS AI AGENT OS                   │
├─────────────────────────────────────────────────┤
│ L6: Safety & Alignment (AI Alignment Monitor)   │
│ L5: Reputation & Trust (0G DA + Chain)          │
│ L4: Execution (0G Compute + TeeML)             │
│ L3: Memory (0G Storage Log + KV)               │
│ L2: Skill Composition (OpenClaw + INFT)         │
│ L1: Identity & Birth (ERC-7857 INFT)           │
├─────────────────────────────────────────────────┤
│ 0G: Chain │ Storage │ Compute │ DA │ Alignment  │
└─────────────────────────────────────────────────┘
```

## Tech Stack

- **Smart Contracts**: Solidity 0.8.28 (Hardhat, OpenZeppelin v5)
- **Backend**: TypeScript, Express.js, @0gfoundation/0g-ts-sdk, @0glabs/0g-serving-broker
- **Frontend**: Next.js 14, Tailwind CSS, ethers.js, Pxlkit (pixel UI)
- **Agent Orchestration**: OpenClaw-compatible multi-agent framework
- **UI Theme**: Pixel art / retro 8-bit with Press Start 2P font
- **Mascot**: Nex the Robot Fox (24x24 pixel art, 3 variants)
- **Network**: 0G Galileo Testnet (Chain ID: 16602)

## Project Structure

```
nexus/
├── contracts/          # 4 Solidity contracts + interfaces + tests (29 passing)
├── backend/            # TypeScript API server + 0G SDK integrations
├── frontend/           # Next.js pixel dashboard (8 pages + 3D hero)
├── agents/             # Agent definitions + 3 skill modules + orchestrator
├── scripts/            # Deploy, seed, verify scripts
├── docs/               # Architecture, API reference, demo script
└── test/               # Additional test suites
```

Every folder contains a `CONTEXT.md` file explaining its contents and relation to the hackathon.

## Quick Start

### Prerequisites
- Node.js >= 18
- MetaMask wallet with 0G testnet tokens
- 0G Faucet: https://faucet.0g.ai

### 1. Deploy Contracts

```bash
cd contracts
npm install
cp .env.example .env    # Add your PRIVATE_KEY
npx hardhat compile
npx hardhat test         # 29 tests should pass
npx hardhat run scripts/deploy.js --network og-testnet
npx hardhat run scripts/seed.js --network og-testnet
```

### 2. Start Backend

```bash
cd backend
npm install
cp .env.example .env    # Add contract addresses from deploy output
npm run dev             # Starts on port 3001
```

### 3. Start Frontend

```bash
cd frontend
npm install
cp .env.example .env    # Add contract addresses
npm run dev             # Starts on port 3000
```

### 4. Verify 0G Integration

```bash
cd contracts
npx hardhat run scripts/verify-0g-integration.js --network og-testnet
# Verifies all 6 0G components are live and working
```

## Smart Contracts

| Contract | Description | Tests |
|----------|-------------|-------|
| `NexusAgentINFT` | ERC-7857 INFT for agent identity (mint, transfer, clone, authorizeUsage) | 7 |
| `SkillRegistry` | Skill marketplace (create, pay-per-use, subscribe, royalties) | 5 |
| `ReputationEngine` | On-chain reputation (4 dimensions, DA proof references) | 4 |
| `AgentEscrow` | Trustless task escrow (create, complete, dispute, release) | 7 |
| `FullFlow` | End-to-end integration test (mint → skill → equip → reputation → task) | 3 |
| | **Total** | **29** |

## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | 3D pixel hero with Nex mascot, 6-layer overview, 0G stack |
| Dashboard | `/dashboard` | On-chain stats, recent agents/skills, quick actions |
| Agent Explorer | `/agents` | Browse all agents from blockchain |
| Agent Detail | `/agents/[id]` | Reputation radar, skills, action history (DA proofs) |
| Agent Creator | `/agents/create` | Mint new agent INFT with model selection |
| Skill Marketplace | `/skills` | Browse/create skills from on-chain |
| Chat Interface | `/interact` | Chat with agents via 0G Compute (TeeML) |
| Task Board | `/tasks` | Create escrow tasks, track status |
| Leaderboard | `/leaderboard` | On-chain reputation rankings |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents/list` | List all agents (on-chain) |
| GET | `/api/agents/:id` | Agent details + reputation |
| GET | `/api/agents/:id/actions` | Action history (DA proofs) |
| POST | `/api/agents/mint` | Create agent (Storage + Chain) |
| GET | `/api/skills/list` | List all skills (on-chain) |
| POST | `/api/skills/create` | Create skill (Storage + Chain) |
| POST | `/api/inference` | Run inference (0G Compute + TeeML) |
| GET | `/api/leaderboard` | Reputation leaderboard (on-chain) |
| GET | `/api/stats` | Platform stats (on-chain) |
| POST | `/api/tasks/create` | Create escrow task |
| GET | `/api/tasks/list` | List tasks (on-chain) |
| GET | `/api/health` | Health check |

## Testnet Info (Galileo)

| | |
|---|---|
| **Chain ID** | 16602 |
| **RPC** | https://evmrpc-testnet.0g.ai |
| **Explorer** | https://chainscan-galileo.0g.ai |
| **Faucet** | https://faucet.0g.ai |

### For Judges
1. Visit the live demo: https://frontend-pi-one-48.vercel.app
2. Or run locally: clone repo → `npm install` in each folder → `npm run dev`
3. Connect MetaMask to 0G Galileo Testnet (auto-added by the app)
4. All data is fetched directly from on-chain contracts — no mockups

## Documentation

- [Architecture Details](docs/architecture.md)
- [0G Integration Guide](docs/0g-integration.md)
- [API Reference](docs/api-reference.md)
- [Demo Script](docs/demo-script.md)
- [Submission Checklist](docs/submission-checklist.md)

## License

MIT
