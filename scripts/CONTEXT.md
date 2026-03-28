# scripts/ — Deploy & Utility Scripts

## Konteks untuk AI Collaborator

Folder ini berisi script untuk deployment dan utility operations.

## Files

- `deploy.js` — Deploy semua smart contracts ke 0G Mainnet/Testnet
  - Urutan deploy: MockOracle → NexusAgentINFT → SkillRegistry → ReputationEngine → AgentEscrow
  - Setelah deploy, set cross-references (reputation reporter, dll)
  - Output: deployed addresses ke console + .env file

- `seed.js` — Seed data untuk demo
  - Mint sample agents (Analyst, Coder, Coordinator)
  - Create sample skills (Sentiment, Risk Scoring, Code Review)
  - Set initial reputation scores

- `verify.js` — Verify contracts di 0G Explorer

## Network Config
- Mainnet: Chain ID 16661, RPC https://evmrpc.0g.ai
- Testnet: Chain ID 16600, RPC https://evmrpc-testnet.0g.ai

## Cara Pakai
```bash
# Deploy ke testnet dulu
npx hardhat run scripts/deploy.js --network og-testnet

# Seed demo data
npx hardhat run scripts/seed.js --network og-testnet

# Deploy ke mainnet (final)
npx hardhat run scripts/deploy.js --network og-mainnet
```
