# 0G Integration Details

## Summary

Nexus integrates ALL 6 core 0G components:

| Component | Usage | Layer |
|-----------|-------|-------|
| 0G Chain | Smart contracts, on-chain reputation, escrow | L1, L5 |
| 0G Storage (Log) | Immutable agent history, action logs | L3 |
| 0G Storage (KV) | Working memory, agent state | L3 |
| 0G Compute | AI inference with TeeML verification | L4 |
| 0G DA | Action proof posting for auditability | L5 |
| Agent ID (ERC-7857) | Agent identity, skill INFTs | L1, L2 |
| AI Alignment | Safety monitoring, drift detection | L6 |

## 0G Chain (Layer 1, 5)

**What**: EVM-compatible L1 with 11K TPS and sub-second finality.

**How we use it**:
- Deploy 4 smart contracts (NexusAgentINFT, SkillRegistry, ReputationEngine, AgentEscrow)
- All agent minting, skill creation, reputation updates, and escrow operations happen on-chain
- Mainnet: Chain ID 16661, RPC https://evmrpc.0g.ai

**Why 0G Chain specifically**:
- Sub-second finality needed for real-time reputation updates
- Low gas fees make micropayments viable (skill pay-per-use)
- EVM compatibility means standard Solidity tooling works

## 0G Storage (Layer 3)

**What**: Decentralized storage with dual-layer architecture.

**How we use it**:
- **Log Layer** (append-only): Store immutable agent history — every decision, reasoning chain, interaction. Can never be deleted or modified. Perfect audit trail.
- **KV Layer** (mutable): Store agent working memory — current state, user preferences, active context. Fast key-based retrieval for real-time agent operation.
- Store encrypted agent metadata (model weights, config) referenced by INFT
- Store encrypted skill weights referenced by SkillRegistry

**SDK**: @0gfoundation/0g-ts-sdk
**Indexer**: https://indexer-storage-turbo.0g.ai

## 0G Compute (Layer 4)

**What**: Decentralized GPU marketplace with TeeML verification.

**How we use it**:
- ALL AI inference in Nexus runs on 0G Compute
- TeeML ensures outputs are cryptographically verified — can't be faked
- Models used: DeepSeek V3, GPT-OSS-120B, Qwen3 VL (all live on mainnet)
- Safety monitoring also runs on 0G Compute (meta-inference)

**SDK**: @0glabs/0g-serving-broker
**Marketplace**: https://compute-marketplace.0g.ai

**Why not centralized inference**:
- TeeML verification is core to Nexus trust model
- Reputation scores are only meaningful if inference is verifiable
- Aligns with 0G vision: "AI is transparent"

## 0G DA (Layer 5)

**What**: Data availability layer with 50 Gbps throughput.

**How we use it**:
- Post action proofs for every agent action
- Proofs are permanent and auditable by anyone
- ReputationEngine references DA proof hashes on-chain
- Dispute resolution uses DA proofs as evidence

**Why DA instead of just Storage**:
- DA guarantees data is always accessible (not just stored)
- Erasure coding + VRF node selection prevents data withholding
- Lighter weight than full storage for proof blobs

## Agent ID / ERC-7857 (Layer 1, 2)

**What**: NFT standard for AI agents with encrypted metadata.

**How we use it**:
- **Agent Identity**: Every agent is an INFT with encrypted brain
- **Skill Modules**: Skills are also INFTs with encrypted weights
- **secureTransfer()**: Transfer agent with oracle re-encryption
- **clone()**: Fork agent (create copy with same intelligence)
- **authorizeUsage()**: Grant usage rights without ownership (subscription model)

**Key innovation**: We use BOTH Clone and AuthorizedUsage — features that exist in the ERC-7857 spec but haven't been implemented by any project in the 0G ecosystem yet.

## AI Alignment (Layer 6)

**What**: Specialized nodes that monitor AI behavior for safety.

**How we use it**:
- Continuous monitoring of all active agents
- Detect model drift (behavior deviates from spec)
- Flag anomalies and harmful outputs
- Compute safety scores that feed into ReputationEngine

**Implementation note**: For hackathon, we implement the monitoring logic as a service that demonstrates the Alignment Node concept. In production, this would integrate with actual 0G AI Alignment Nodes as they become available for application-level integration.
