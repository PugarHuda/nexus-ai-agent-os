# Nexus — Decentralized AI Agent Operating System

> Built on 0G Infrastructure | Track 1: Agentic Infrastructure & OpenClaw Lab
> 0G APAC Hackathon 2026

## What is Nexus?

Nexus is the OS layer for AI agents on 0G — where agents are born, learn, collaborate, build reputation, and get monetized. It unifies all 6 core 0G components into a single composable platform.

**Problem:** AI agents in Web3 are fragmented. No way for agents to have verifiable identity, share skills, build reputation, or collaborate trustlessly.

**Solution:** Nexus provides 6 layers — Identity (INFT), Skill Composition (OpenClaw), Memory (0G Storage), Execution (0G Compute + TeeML), Reputation (0G DA), and Safety (AI Alignment).

## 0G Components Used

| Component | Usage | Layer |
|-----------|-------|-------|
| **0G Chain** | Smart contracts, on-chain reputation, escrow | L1, L5 |
| **0G Storage** | Agent memory (Log + KV layers), encrypted metadata | L3 |
| **0G Compute** | AI inference with TeeML verification | L4 |
| **0G DA** | Action proof posting for auditability | L5 |
| **Agent ID (ERC-7857)** | Agent identity, skill INFTs, clone, authorizeUsage | L1, L2 |
| **AI Alignment** | Safety monitoring, drift detection | L6 |

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
- **Frontend**: Next.js 14, Tailwind CSS, ethers.js
- **Agent Orchestration**: OpenClaw-compatible multi-agent framework
- **Network**: 0G Mainnet (Chain ID: 16661)

## Project Structure

```
nexus/
├── contracts/          # 4 Solidity contracts + interfaces + tests (29 passing)
├── backend/            # TypeScript API server + 0G SDK integrations
├── frontend/           # Next.js dashboard (7 pages)
├── agents/             # Agent definitions + 3 skill modules + orchestrator
├── scripts/            # Deploy, seed, verify scripts
├── docs/               # Architecture, API reference, demo script
└── test/               # Additional test suites
```

## Quick Start

### Prerequisites
- Node.js >= 18
- MetaMask wallet with 0G tokens
- 0G Mainnet RPC: `https://evmrpc.0g.ai`

### 1. Deploy Contracts

```bash
cd contracts
npm install
cp .env.example .env    # Add your PRIVATE_KEY
npx hardhat compile
npx hardhat test         # 29 tests should pass

# Deploy to testnet first
npx hardhat run scripts/deploy.js --network og-testnet

# Then mainnet
npx hardhat run scripts/deploy.js --network og-mainnet
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

### 4. Seed Demo Data

```bash
cd contracts
npx hardhat run scripts/seed.js --network og-mainnet
```

## Smart Contracts

| Contract | Description |
|----------|-------------|
| `NexusAgentINFT` | ERC-7857 INFT for agent identity (mint, transfer, clone, authorizeUsage) |
| `SkillRegistry` | Skill marketplace (create, pay-per-use, subscribe, royalties) |
| `ReputationEngine` | On-chain reputation (4 dimensions, DA proof references) |
| `AgentEscrow` | Trustless task escrow (create, complete, dispute, release) |

## Mainnet Info

- **Chain ID**: 16661
- **RPC**: https://evmrpc.0g.ai
- **Explorer**: https://chainscan.0g.ai
- **Storage Indexer**: https://indexer-storage-turbo.0g.ai
- **Compute Marketplace**: https://compute-marketplace.0g.ai

## Testing

```bash
cd contracts && npx hardhat test
# 29 passing tests covering all contracts + full integration flow
```

## Documentation

- [Architecture Details](docs/architecture.md)
- [0G Integration Guide](docs/0g-integration.md)
- [API Reference](docs/api-reference.md)
- [Demo Script](docs/demo-script.md)
- [Submission Checklist](docs/submission-checklist.md)

## License

MIT
