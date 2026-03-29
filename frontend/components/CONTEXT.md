# frontend/components/ — Shared React Components

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Judging:** UX/Demo Quality

## What This Folder Contains
Reusable React components shared across all Nexus dashboard pages.

## Key Files
| File | Purpose |
|------|---------|
| `Navbar.tsx` | Top navigation bar — wallet connect button, page links, network status indicator |
| `PixelHero3D.tsx` | 3D pixel art hero component for the landing page |
| `PixelButton.tsx` | Styled button component with pixel art theme |
| `PixelCard.tsx` | Card component for agent/skill display with pixel art borders |
| `ReputationRadar.tsx` | Radar chart showing 4 reputation dimensions (accuracy, reliability, safety, collaboration) |

## Design Theme
Pixel art aesthetic — all components use a retro pixel style with neon accents. This creates a distinctive visual identity for the hackathon demo.

## 0G Relevance
- `Navbar.tsx` shows 0G Chain connection status and auto-adds Galileo Testnet to MetaMask
- `ReputationRadar.tsx` visualizes on-chain reputation data from ReputationEngine contract
