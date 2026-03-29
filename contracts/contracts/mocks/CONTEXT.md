# contracts/contracts/mocks/ — Mock Contracts for Testing

## Hackathon Context
- **Hackathon:** 0G APAC Hackathon 2026 | Track 1: Agentic Infrastructure & OpenClaw Lab
- **Network:** 0G Galileo Testnet (Chain ID: 16602, RPC: https://evmrpc-testnet.0g.ai)

## What This Folder Contains
Mock contracts used in Hardhat tests to simulate external dependencies.

## Key Files
- `MockOracle.sol` — Simulates the TEE oracle that verifies re-encryption proofs during INFT transfers. In production, this would be a real TEE (Trusted Execution Environment) node on 0G.

## 0G Relevance
The mock oracle stands in for 0G's TEE infrastructure during local testing. It always returns `true` for proof verification, allowing the full INFT transfer flow to be tested without a live TEE node.

## Usage
Deployed first in test setup, then passed to `NexusAgentINFT` constructor.
```bash
npx hardhat test  # MockOracle is auto-deployed in test fixtures
```
