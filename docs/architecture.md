# Nexus Architecture — 6-Layer AI Agent OS

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXUS AI AGENT OS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 6: Safety & Alignment                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ AI Alignment Monitor │ Drift Detection │ Auto-Flag  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 5: Reputation & Trust                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ReputationEngine │ Action Proofs (0G DA) │ Scores   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 4: Execution & Verification                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 0G Compute │ TeeML Verification │ Escrow Settlement │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 3: Memory & State                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 0G Storage Log Layer │ 0G Storage KV Layer          │   │
│  │ (immutable history)  │ (working memory)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 2: Skill Composition                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ SkillRegistry │ OpenClaw Orchestration │ INFT Skills│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 1: Identity & Birth                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ NexusAgentINFT (ERC-7857) │ Encrypted Brain │ Clone │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              0G INFRASTRUCTURE LAYER                         │
│  ┌──────┐ ┌─────────┐ ┌──────────┐ ┌────┐ ┌──────────┐   │
│  │Chain │ │ Storage  │ │ Compute  │ │ DA │ │Alignment │   │
│  │16661 │ │Log + KV  │ │ TeeML    │ │    │ │  Nodes   │   │
│  └──────┘ └─────────┘ └──────────┘ └────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### Layer 1: Identity & Birth
- **Contract**: NexusAgentINFT.sol (ERC-7857)
- **0G Component**: 0G Chain + 0G Storage
- **Function**: Every agent gets an INFT containing encrypted metadata (model config, weights, capabilities). Supports secure transfer (oracle re-encryption), clone (fork agent), and authorizeUsage (subscription).

### Layer 2: Skill Composition
- **Contract**: SkillRegistry.sol
- **0G Component**: 0G Storage + 0G Compute + OpenClaw
- **Function**: Modular skills as separate INFTs. Agents equip skills via authorizeUsage. Skills composed via OpenClaw orchestration. Revenue model: pay-per-use or subscription with automatic royalty distribution.

### Layer 3: Memory & State
- **0G Component**: 0G Storage (dual-layer)
- **Log Layer**: Immutable agent history (all decisions, reasoning chains, interactions). Append-only, auditable.
- **KV Layer**: Working memory (current state, user preferences, active context). Fast key-based retrieval, updatable.

### Layer 4: Execution & Verification
- **0G Component**: 0G Compute (TeeML)
- **Function**: All AI inference runs on 0G Compute with TeeML verification. Outputs are cryptographically signed — can't be faked. Payment via smart contract escrow (AgentEscrow.sol).

### Layer 5: Reputation & Trust
- **Contract**: ReputationEngine.sol
- **0G Component**: 0G DA + 0G Chain
- **Function**: Every agent action generates a proof posted to 0G DA. Reputation computed from 4 dimensions: accuracy (30%), reliability (25%), safety (30%), collaboration (15%). Scores are on-chain and transferable with INFT.

### Layer 6: Safety & Alignment
- **0G Component**: AI Alignment Node concept
- **Function**: Continuous monitoring of all active agents. Detects model drift, flags anomalies, computes safety scores. In production, integrates with 0G AI Alignment Nodes. For hackathon, implemented as monitoring service demonstrating the architecture.

## Data Flow: Agent Inference

```
User Request
    │
    ▼
[API Server] ──→ [0G Compute: TeeML Inference]
    │                      │
    │                      ▼
    │              [TeeML Proof Generated]
    │                      │
    ▼                      ▼
[Safety Monitor] ◄── [Agent Output + Proof]
    │                      │
    ▼                      ▼
[0G Storage KV]    [0G DA: Post Action Proof]
(update memory)            │
                           ▼
                   [ReputationEngine: Update Score]
                           │
                           ▼
                   [0G Chain: On-chain Record]
```

## Smart Contract Interaction Map

```
NexusAgentINFT ──── equipSkill() ────→ SkillRegistry
       │                                      │
       │                                      │
  mintAgent()                          payForUse()
  clone()                              subscribe()
  authorizeUsage()                            │
       │                                      │
       └──── agentId ────→ ReputationEngine   │
                                │              │
                          recordAction()       │
                                │              │
                                └──→ AgentEscrow
                                    createTask()
                                    completeTask()
                                    releasePayment()
```
