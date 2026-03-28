/**
 * OpenClaw Agent Orchestrator
 *
 * Coordinates multi-agent collaboration in Nexus.
 * Uses OpenClaw's task decomposition pattern:
 * 1. Coordinator receives complex task
 * 2. Decomposes into subtasks
 * 3. Routes subtasks to specialist agents
 * 4. Aggregates results
 *
 * Communication: shared task queue (SQLite in OpenClaw, in-memory here for hackathon)
 */

import { runInference, InferenceResult } from "../backend/src/services/compute";
import { postActionProof } from "../backend/src/services/da";

// ─── Types ───────────────────────────────────────────────

interface Task {
  id: string;
  description: string;
  assignedAgent: number; // INFT token ID
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
  createdAt: number;
}

interface OrchestrationPlan {
  originalTask: string;
  subtasks: Task[];
  aggregationStrategy: "merge" | "vote" | "chain";
}

// ─── Task Queue ──────────────────────────────────────────

const taskQueue: Map<string, Task> = new Map();

function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Orchestrator ────────────────────────────────────────

/**
 * Decompose a complex task into subtasks using the Coordinator agent
 */
export async function planOrchestration(
  coordinatorAgentId: number,
  userRequest: string,
  availableAgents: Array<{ id: number; name: string; capabilities: string[] }>
): Promise<OrchestrationPlan> {
  const agentList = availableAgents
    .map((a) => `Agent #${a.id} (${a.name}): ${a.capabilities.join(", ")}`)
    .join("\n");

  const planResult = await runInference({
    agentId: coordinatorAgentId,
    model: "deepseek-chat-v3-0324",
    messages: [
      {
        role: "system",
        content: `You are the Nexus Coordinator. Decompose the user's request into subtasks and assign each to the best available agent.

Available agents:
${agentList}

Respond with JSON:
{
  "subtasks": [
    { "description": "...", "assignedAgentId": <number>, "reason": "..." }
  ],
  "aggregationStrategy": "merge"|"vote"|"chain"
}`,
      },
      { role: "user", content: userRequest },
    ],
    temperature: 0.3,
  });

  let parsed: any;
  try {
    parsed = JSON.parse(planResult.output);
  } catch {
    // Fallback: single task assigned to first agent
    parsed = {
      subtasks: [{ description: userRequest, assignedAgentId: availableAgents[0]?.id || 1, reason: "fallback" }],
      aggregationStrategy: "merge",
    };
  }

  const subtasks: Task[] = parsed.subtasks.map((st: any) => ({
    id: generateTaskId(),
    description: st.description,
    assignedAgent: st.assignedAgentId,
    status: "pending" as const,
    createdAt: Date.now(),
  }));

  // Register in queue
  subtasks.forEach((t) => taskQueue.set(t.id, t));

  return {
    originalTask: userRequest,
    subtasks,
    aggregationStrategy: parsed.aggregationStrategy || "merge",
  };
}

/**
 * Execute all subtasks in an orchestration plan
 */
export async function executeOrchestration(plan: OrchestrationPlan): Promise<string> {
  const results: InferenceResult[] = [];

  if (plan.aggregationStrategy === "chain") {
    // Sequential: each task feeds into the next
    let previousOutput = "";
    for (const task of plan.subtasks) {
      task.status = "running";
      const input = previousOutput
        ? `Previous step result: ${previousOutput}\n\nYour task: ${task.description}`
        : task.description;

      const result = await runInference({
        agentId: task.assignedAgent,
        model: "deepseek-chat-v3-0324",
        messages: [{ role: "user", content: input }],
      });

      task.status = "completed";
      task.result = result.output;
      previousOutput = result.output;
      results.push(result);

      // Post proof for each step
      await postActionProof({
        agentId: task.assignedAgent,
        action: "orchestrated_task",
        input: task.description,
        output: result.output,
        model: "deepseek-chat-v3-0324",
        teemlProof: result.verificationProof,
        timestamp: Date.now(),
      });
    }
  } else {
    // Parallel: all tasks run simultaneously
    const promises = plan.subtasks.map(async (task) => {
      task.status = "running";
      const result = await runInference({
        agentId: task.assignedAgent,
        model: "deepseek-chat-v3-0324",
        messages: [{ role: "user", content: task.description }],
      });
      task.status = "completed";
      task.result = result.output;

      await postActionProof({
        agentId: task.assignedAgent,
        action: "orchestrated_task",
        input: task.description,
        output: result.output,
        model: "deepseek-chat-v3-0324",
        teemlProof: result.verificationProof,
        timestamp: Date.now(),
      });

      return result;
    });

    results.push(...(await Promise.all(promises)));
  }

  // Aggregate results
  const aggregated = plan.subtasks
    .map((t, i) => `[Agent #${t.assignedAgent}] ${t.description}:\n${t.result}`)
    .join("\n\n---\n\n");

  return aggregated;
}

/**
 * Full orchestration pipeline: plan → execute → aggregate
 */
export async function orchestrate(
  coordinatorAgentId: number,
  userRequest: string,
  availableAgents: Array<{ id: number; name: string; capabilities: string[] }>
): Promise<{ plan: OrchestrationPlan; result: string }> {
  const plan = await planOrchestration(coordinatorAgentId, userRequest, availableAgents);
  const result = await executeOrchestration(plan);
  return { plan, result };
}
