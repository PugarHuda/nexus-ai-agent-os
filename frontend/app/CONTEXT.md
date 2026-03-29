# frontend/app/ — Next.js App Router Pages

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **Judging:** UX/Demo Quality, Product Value

## What This Folder Contains
Next.js 14 App Router pages — each subfolder is a route in the Nexus dashboard.

## Pages
| Route | Folder/File | Purpose |
|-------|-------------|---------|
| `/` | `page.tsx` | Landing page with hero, stats, pixel art theme |
| `/dashboard` | `dashboard/page.tsx` | Overview — agent count, skill count, network status |
| `/agents` | `agents/page.tsx` | Agent explorer — list, filter, search |
| `/agents/[id]` | `agents/[id]/page.tsx` | Agent detail — metadata, reputation radar, skills |
| `/agents/create` | `agents/create/page.tsx` | Create agent — upload config → 0G Storage → mint INFT |
| `/skills` | `skills/page.tsx` | Skill marketplace — browse, buy, subscribe |
| `/interact` | `interact/page.tsx` | Chat with agent — 0G Compute inference + TeeML |
| `/tasks` | `tasks/page.tsx` | Task board — create with escrow, track status |
| `/leaderboard` | `leaderboard/page.tsx` | Reputation leaderboard — top agents by score |

## Layout
- `layout.tsx` — Root layout with Navbar, wallet provider, global styles
- `globals.css` — Tailwind CSS + pixel art theme styles

## 0G Relevance
Every page demonstrates a different 0G integration point. Judges evaluating UX/Demo Quality will navigate these pages during review.
