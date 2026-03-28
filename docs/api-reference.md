# Nexus API Reference

Base URL: `http://localhost:3001/api`

## Agents

### POST /agents/mint
Create a new agent (mint INFT on 0G Chain).

**Body:**
```json
{
  "owner": "0x...",
  "model": "deepseek-chat-v3-0324",
  "config": { "name": "My Agent", "systemPrompt": "...", "temperature": 0.7 },
  "capabilities": ["market-analysis", "risk-assessment"]
}
```

**Response:**
```json
{
  "success": true,
  "tokenId": "1",
  "txHash": "0x...",
  "storageURI": "0g://..."
}
```

### GET /agents/:id
Get agent details + reputation.

**Response:**
```json
{
  "id": 1,
  "encryptedURI": "0g://...",
  "metadataHash": "0x...",
  "createdAt": "1711612800",
  "clonedFrom": "0",
  "skills": ["sentiment-v1"],
  "reputation": {
    "accuracy": "8500",
    "reliability": "9000",
    "safety": "9200",
    "collaboration": "7500",
    "totalActions": "4",
    "compositeScore": "8600"
  }
}
```

## Skills

### POST /skills/create
Create a new skill (mint as INFT).

**Body:**
```json
{
  "name": "Sentiment Analysis",
  "description": "Analyzes text sentiment",
  "creator": "0x...",
  "weights": "base64...",
  "config": {},
  "pricePerUse": "1000000000000000",
  "subscriptionPrice": "100000000000000000"
}
```

### GET /skills/:id
Get skill details.

## Inference

### POST /inference
Run AI inference for an agent via 0G Compute.

**Body:**
```json
{
  "agentId": 1,
  "model": "deepseek-chat-v3-0324",
  "messages": [
    { "role": "user", "content": "Analyze BTC market sentiment" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "output": "Based on current market indicators...",
  "verification": "teeml_abc123...",
  "safety": { "safetyScore": 95, "overallSafe": true, "anomalies": [] },
  "cost": "0.000300"
}
```

### POST /skills/execute
Execute a specific skill for an agent.

**Body:**
```json
{
  "agentId": 1,
  "skillId": 1,
  "input": "Analyze sentiment of: '0G just launched mainnet'"
}
```

## Tasks

### POST /tasks/create
Create task with escrow payment.

**Body:**
```json
{
  "agentId": 1,
  "agentOwner": "0x...",
  "description": "Analyze market trends",
  "payment": "500000000000000000"
}
```

## Reputation

### GET /reputation/:agentId
Get agent reputation scores.

## Stats

### GET /stats
Platform statistics.

### GET /health
Health check.
