# contracts/ — Smart Contracts Layer

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026
- **Track:** Track 1 — Agentic Infrastructure & OpenClaw Lab
- **Prize Pool:** $150,000 USD (1st: $45K, 2nd: $35K, 3rd: $20K)
- **Deadline:** May 9, 2026, 23:59 UTC+8
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Chain, Storage, Compute, DA, Agent ID (ERC-7857), AI Alignment
- **Judging:** 0G Integration Depth, Technical Completeness, Product Value, UX/Demo Quality, Documentation

## Konteks untuk AI Collaborator

Folder ini berisi semua Solidity smart contracts untuk Nexus, di-deploy ke 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai) untuk hackathon submission, dan 0G Mainnet (Chain ID 16661, RPC: https://evmrpc.0g.ai) untuk production.

## File-file di folder ini:

### Core Contracts
- `NexusAgentINFT.sol` — Kontrak utama INFT (ERC-7857) untuk agent identity. Setiap agent yang "lahir" di Nexus mendapat INFT yang berisi encrypted metadata (model weights, config, capabilities). Mendukung `transfer()` dengan re-encryption, `clone()` untuk duplikasi agent, dan `authorizeUsage()` untuk subscription model.

- `SkillRegistry.sol` — Registry untuk skill modules. Skill juga di-mint sebagai INFT terpisah. Agent bisa "equip" skill via authorizeUsage. Skill bisa di-compose (agent punya multiple skills). Mendukung royalty otomatis ke skill creator.

- `ReputationEngine.sol` — Sistem reputasi on-chain. Menghitung score dari: accuracy rate, reliability, safety score, collaboration score. Score di-update dari proof-of-action yang di-post via 0G DA. Reputation transferable bersama INFT.

- `AgentEscrow.sol` — Escrow untuk transaksi antar-agent dan agent-user. Dana terkunci saat request dikirim, lepas saat komputasi terverifikasi. Mendukung dispute resolution.

### Supporting
- `interfaces/` — Interface definitions (IERC7857, IOracle, ISkillRegistry, IReputationEngine)
- `libraries/` — Shared libraries (ProofVerifier, MetadataEncoder)
- `mocks/` — Mock contracts untuk testing

## Testing
Tests are in `contracts/test/` (Hardhat convention).
Run: `cd contracts && npx hardhat test`
All 26 tests passing as of initial scaffold.

## Dependencies
- OpenZeppelin Contracts (ERC721, Ownable, ReentrancyGuard)
- Hardhat untuk compilation & deployment
- 0G Mainnet contract addresses:
  - Flow: 0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526
  - Mine: 0xCd01c5Cd953971CE4C2c9bFb95610236a7F414fe

## Network Config
```
Network: 0G Mainnet
Chain ID: 16661
RPC: https://evmrpc.0g.ai
Explorer: https://chainscan.0g.ai
Token: 0G (native)
```

## Cara kerja INFT (ERC-7857):
1. Creator membuat agent → encrypt metadata → simpan di 0G Storage → mint INFT
2. Transfer: oracle (TEE) re-encrypt metadata untuk new owner → proof diverifikasi on-chain
3. Clone: buat INFT baru dengan metadata yang sama (untuk template/forking)
4. AuthorizeUsage: grant akses tanpa transfer ownership (untuk subscription/rental)
