# 0G APAC Hackathon — Submission Checklist

## Required Materials

### 1. Basic Project Information ✅
- [x] Project name: **Nexus**
- [x] One-sentence description (≤30 words): "Nexus is the decentralized OS for AI agents on 0G — where agents are born as INFTs, equip modular skills, build on-chain reputation, and get monetized trustlessly."
- [x] Short summary: what it does, problem solved, 0G components used

### 2. Code Repository ✅
- [x] GitHub repository link (public)
- [x] Substantial development progress during hackathon
- [x] Meaningful commits (not placeholder)

### 3. 0G Integration Proof ⬜ (after deploy)
- [ ] 0G mainnet/testnet contract address
- [ ] 0G Explorer link showing on-chain activity
- [ ] Clear proof of 0G component integration:
  - [x] 0G Chain: 4 contracts deployed (NexusAgentINFT, SkillRegistry, ReputationEngine, AgentEscrow)
  - [x] 0G Storage: agent metadata + skill weights uploaded via @0gfoundation/0g-ts-sdk
  - [x] 0G Compute: inference calls with TeeML verification via @0glabs/0g-serving-broker
  - [x] Agent ID (ERC-7857): INFT minting, clone, authorizeUsage — all implemented
  - [x] 0G DA: action proofs posted via Storage Log Layer (immutable)
  - [x] AI Alignment: safety monitoring service with drift detection

### 4. Demo Video ⬜
- [ ] ≤3 minutes
- [ ] Shows core functionality
- [ ] Shows user flow
- [ ] Shows how 0G components are used
- [ ] Upload to YouTube or Loom
- [ ] Script: see `docs/demo-script.md`

### 5. README / Documentation ✅
- [x] Project overview
- [x] System architecture diagram (`docs/architecture.md`)
- [x] 0G modules explanation (`docs/0g-integration.md`)
- [x] How modules support the product
- [x] Local deployment steps
- [x] Test account details / faucet instructions
- [x] API reference (`docs/api-reference.md`)

### 6. Public X Post ⬜
- [ ] Project name
- [ ] Demo screenshot or clip
- [ ] Hashtags: #0GHackathon #BuildOn0G
- [ ] Tags: @0G_labs @0g_CN @0g_Eco @HackQuest_

### 7. Optional Bonus Materials
- [x] Architecture documentation
- [ ] Pitch deck / slides
- [ ] Frontend demo link
- [x] Technical write-up (0G integration details)
- [x] 29 passing tests

## Deployment Steps

```bash
# 1. Deploy contracts to 0G testnet first
cd contracts
cp .env.example .env  # Fill in PRIVATE_KEY
npx hardhat run scripts/deploy.js --network og-testnet

# 2. Copy addresses to all .env files
# 3. Seed demo data
npx hardhat run scripts/seed.js --network og-testnet

# 4. Start backend
cd ../backend
cp .env.example .env  # Fill in contract addresses
npm install
npm run dev

# 5. Start frontend
cd ../frontend
cp .env.example .env  # Fill in contract addresses
npm install
npm run dev

# 6. Test full flow in browser
# 7. Deploy to mainnet when ready
cd ../contracts
npx hardhat run scripts/deploy.js --network og-mainnet
npx hardhat run scripts/seed.js --network og-mainnet

# 8. Verify contracts
npx hardhat run scripts/verify.js --network og-mainnet
```

## Track
**Track 1: Agentic Infrastructure & OpenClaw Lab**

## Judging Criteria Alignment
1. **0G Technical Integration Depth & Innovation** — Uses ALL 6 core 0G components
2. **Technical Implementation & Completeness** — 4 contracts, full backend, 7-page frontend, 29 tests
3. **Product Value & Market Potential** — Agent OS = infrastructure play, network effects
4. **User Experience & Demo Quality** — Clean dashboard, chat interface, reputation visualization
5. **Team Capability & Documentation** — Comprehensive docs, architecture diagrams, demo script
