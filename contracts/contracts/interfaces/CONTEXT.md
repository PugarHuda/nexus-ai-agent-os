# contracts/contracts/interfaces/ — Interface Definitions

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
Solidity interface files that define the contract ABIs for Nexus.

## Key Files
- `IERC7857.sol` — ERC-7857 Intellectual NFT standard interface. Defines `transfer()` with re-encryption, `clone()`, and `authorizeUsage()`. This is the core 0G Agent ID integration.
- `IOracle.sol` — Oracle interface for TEE-based re-encryption verification during INFT transfers.

## 0G Relevance
ERC-7857 (INFT) is a key judging criterion — it demonstrates deep integration with 0G's Agent ID system. The interface supports encrypted metadata stored on 0G Storage, with TEE oracle verification for secure transfers.

## Usage
These interfaces are implemented by the core contracts and used for type-safe cross-contract calls.
