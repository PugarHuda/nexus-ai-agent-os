import { API_URL } from "./constants";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Agents ──────────────────────────────────────────────

export async function mintAgent(data: {
  owner: string;
  model: string;
  config: Record<string, unknown>;
  capabilities: string[];
}) {
  return fetchAPI<{ success: boolean; tokenId: string; txHash: string }>("/agents/mint", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAgent(id: number) {
  return fetchAPI<{
    id: number;
    owner: string;
    encryptedURI: string;
    metadataHash: string;
    createdAt: string;
    clonedFrom: string;
    skills: string[];
    reputation: {
      accuracy: string;
      reliability: string;
      safety: string;
      collaboration: string;
      totalActions: string;
      compositeScore: string;
    };
  }>(`/agents/${id}`);
}

/** List all agents from on-chain */
export async function listAgents() {
  return fetchAPI<{
    success: boolean;
    agents: Array<{
      id: number;
      owner: string;
      encryptedURI: string;
      metadataHash: string;
      createdAt: string;
      clonedFrom: string;
      skills: string[];
      reputation: {
        accuracy: string;
        reliability: string;
        safety: string;
        collaboration: string;
        totalActions: string;
        compositeScore: string;
      };
    }>;
  }>("/agents/list");
}

// ─── Skills ──────────────────────────────────────────────

export async function createSkill(data: {
  name: string;
  description: string;
  creator: string;
  weights: string;
  config: Record<string, unknown>;
  pricePerUse: string;
  subscriptionPrice: string;
}) {
  return fetchAPI<{ success: boolean; txHash: string }>("/skills/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getSkill(id: number) {
  return fetchAPI(`/skills/${id}`);
}

/** List all skills from on-chain */
export async function listSkills() {
  return fetchAPI<{
    success: boolean;
    skills: Array<{
      id: number;
      name: string;
      description: string;
      creator: string;
      pricePerUse: string;
      subscriptionPrice: string;
      totalUses: string;
      totalRevenue: string;
      active: boolean;
    }>;
  }>("/skills/list");
}

// ─── Inference ───────────────────────────────────────────

export async function runInference(data: {
  agentId: number;
  model: string;
  messages: Array<{ role: string; content: string }>;
}) {
  return fetchAPI<{
    success: boolean;
    output: string;
    verification: string;
    safety: { safetyScore: number; overallSafe: boolean; anomalies: string[] };
    cost: string;
  }>("/inference", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Tasks ───────────────────────────────────────────────

export async function createTask(data: {
  agentId: number;
  agentOwner: string;
  description: string;
  payment: string;
}) {
  return fetchAPI<{ success: boolean; txHash: string }>("/tasks/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** List all tasks from on-chain */
export async function listTasks() {
  return fetchAPI<{
    success: boolean;
    tasks: Array<{
      id: number;
      requester: string;
      agentId: number;
      agentOwner: string;
      payment: string;
      description: string;
      status: number;
      createdAt: string;
    }>;
  }>("/tasks/list");
}

// ─── Health ──────────────────────────────────────────────

export async function getHealth() {
  return fetchAPI<{ status: string; network: string; chainId: number }>("/health");
}

// ─── Stats ───────────────────────────────────────────────

export async function getStats() {
  return fetchAPI<{
    totalAgents: string;
    totalSkills: string;
    activeSkills: string;
    network: string;
    chainId: number;
  }>("/stats");
}

// ─── Leaderboard ─────────────────────────────────────────

/** Get on-chain reputation leaderboard */
export async function getLeaderboard() {
  return fetchAPI<{
    success: boolean;
    leaderboard: Array<{
      agentId: number;
      owner: string;
      accuracy: string;
      reliability: string;
      safety: string;
      collaboration: string;
      totalActions: string;
      compositeScore: string;
    }>;
  }>("/leaderboard");
}

// ─── Reputation ──────────────────────────────────────────

export async function getReputation(agentId: number) {
  return fetchAPI<{
    agentId: number;
    accuracy: string;
    reliability: string;
    safety: string;
    collaboration: string;
    totalActions: string;
    compositeScore: string;
  }>(`/reputation/${agentId}`);
}

/** Get on-chain action history (DA proofs) for an agent */
export async function getActionHistory(agentId: number) {
  return fetchAPI<{
    success: boolean;
    actions: Array<{
      dimension: number;
      score: number;
      daProofHash: string;
      timestamp: string;
    }>;
  }>(`/agents/${agentId}/actions`);
}
