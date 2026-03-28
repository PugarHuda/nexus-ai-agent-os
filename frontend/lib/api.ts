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

// ─── Health ──────────────────────────────────────────────

export async function getHealth() {
  return fetchAPI<{ status: string; network: string; chainId: number }>("/health");
}
