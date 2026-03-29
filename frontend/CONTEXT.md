# frontend/ — Next.js Dashboard

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Prize Pool:** $150,000 USD (1st: $45K, 2nd: $35K, 3rd: $20K)
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Chain, Storage, Compute, DA, Agent ID (ERC-7857), AI Alignment
- **Judging:** 0G Integration Depth, Technical Completeness, Product Value, UX/Demo Quality, Documentation

## Konteks untuk AI Collaborator

Dashboard web untuk Nexus AI Agent OS. Menampilkan semua fungsionalitas platform dalam UI yang intuitif.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ethers.js (wallet connection)
- wagmi + viem (Web3 hooks)

## Pages / Features

### 1. Dashboard (/)
- Overview: total agents, total skills, platform stats
- Recent activity feed
- Network status (0G Chain connection)

### 2. Agent Explorer (/agents)
- List semua agent yang di-mint di Nexus
- Filter by category, reputation score, skills
- Agent detail page: metadata, reputation radar chart, skill list, action history

### 3. Agent Creator (/agents/create)
- Form untuk membuat agent baru
- Upload model config → encrypt → store di 0G Storage → mint INFT
- Equip skills dari marketplace

### 4. Skill Marketplace (/skills)
- Browse available skills
- Filter by category, price, popularity
- Buy/subscribe to skills
- Create new skill (for developers)

### 5. Agent Interaction (/interact)
- Chat interface untuk berinteraksi dengan agent
- Select agent → send message → get TeeML-verified response
- Real-time reputation update visualization
- Safety score display

### 6. Task Board (/tasks)
- Create tasks with escrow payment
- Track task status (Created → InProgress → Completed → Released)
- Dispute resolution interface

### 7. Reputation Leaderboard (/leaderboard)
- Top agents by composite score
- Filter by dimension (accuracy, reliability, safety, collaboration)
- Historical reputation charts

## Wallet Integration
- MetaMask connection to 0G Mainnet
- Chain ID: 16661
- RPC: https://evmrpc.0g.ai
- Auto-add network if not configured

## API Integration
- All data fetched from backend API (localhost:3001)
- Contract reads directly via ethers.js + 0G RPC
- Real-time updates via polling (WebSocket in v2)

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OG_RPC=https://evmrpc.0g.ai
NEXT_PUBLIC_CHAIN_ID=16661
NEXT_PUBLIC_AGENT_CONTRACT=deployed_address
NEXT_PUBLIC_SKILL_CONTRACT=deployed_address
NEXT_PUBLIC_REPUTATION_CONTRACT=deployed_address
NEXT_PUBLIC_ESCROW_CONTRACT=deployed_address
```
