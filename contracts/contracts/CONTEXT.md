# contracts/contracts/ — Solidity Smart Contracts

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)
- **0G Components:** Chain (L1), Agent ID / ERC-7857 (INFT), DA (reputation proofs)

## What This Folder Contains
Core Solidity contracts for the Nexus AI Agent OS, compiled with Hardhat (Solidity 0.8.28).

## Key Files
| File | Purpose | 0G Integration |
|------|---------|----------------|
| `NexusAgentINFT.sol` | ERC-7857 INFT — agent identity, mint/transfer/clone/authorizeUsage | Agent ID (ERC-7857) |
| `SkillRegistry.sol` | Skill marketplace — create, pay-per-use, subscribe, royalties | Chain (on-chain registry) |
| `ReputationEngine.sol` | On-chain reputation — 4 dimensions, DA proof references | DA (action proofs) |
| `AgentEscrow.sol` | Trustless task escrow — create, complete, dispute, release | Chain (escrow logic) |

## Subfolders
- `interfaces/` — Interface definitions (IERC7857, IOracle)
- `mocks/` — Mock contracts for testing (MockOracle)

## Dependencies
- OpenZeppelin Contracts v5 (ERC721, Ownable, ReentrancyGuard)

## Commands
```bash
npx hardhat compile          # Compile all contracts
npx hardhat test             # Run 29 tests
```
