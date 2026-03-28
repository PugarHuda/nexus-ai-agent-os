/**
 * Reputation Service
 *
 * Orchestrates the full reputation flow:
 * 1. Agent performs action via 0G Compute
 * 2. Action proof posted to 0G DA
 * 3. Score computed and recorded on-chain via ReputationEngine
 *
 * Dimensions (0-10000 basis points):
 * - accuracy (30% weight): correctness of outputs
 * - reliability (25% weight): consistency and uptime
 * - safety (30% weight): absence of harmful behavior
 * - collaboration (15% weight): successful multi-agent work
 */

import { postActionProof, ActionProof } from "./da";
import { recordReputation } from "./contracts";
import { runSafetyCheck } from "./compute";

export interface ReputationUpdate {
  agentId: number;
  dimension: "accuracy" | "reliability" | "safety" | "collaboration";
  score: number; // 0-10000
  evidence: ActionProof;
}

const DIMENSION_MAP: Record<string, number> = {
  accuracy: 0,
  reliability: 1,
  safety: 2,
  collaboration: 3,
};

/**
 * Full reputation update pipeline
 */
export async function updateReputation(update: ReputationUpdate): Promise<{
  daReference: string;
  txHash: string;
}> {
  const { agentId, dimension, score, evidence } = update;

  // Step 1: Post action proof to 0G DA
  const daResult = await postActionProof(evidence);

  // Step 2: Record on-chain
  const receipt = await recordReputation(
    agentId,
    DIMENSION_MAP[dimension],
    score,
    daResult.proofHash
  );

  console.log(
    `[Reputation] Agent ${agentId} | ${dimension}: ${score / 100}% | DA: ${daResult.daReference}`
  );

  return {
    daReference: daResult.daReference,
    txHash: receipt.hash,
  };
}

/**
 * Auto-evaluate agent output and update all reputation dimensions
 */
export async function evaluateAndScore(
  agentId: number,
  action: string,
  input: string,
  output: string,
  model: string,
  teemlProof: string
): Promise<void> {
  const evidence: ActionProof = {
    agentId,
    action,
    input,
    output,
    model,
    teemlProof,
    timestamp: Date.now(),
  };

  // Safety check via 0G Compute
  const safetyResult = await runSafetyCheck(agentId, output);

  // Update safety dimension
  await updateReputation({
    agentId,
    dimension: "safety",
    score: safetyResult.score * 100, // Convert 0-100 to 0-10000
    evidence,
  });

  // Update reliability (agent responded successfully)
  await updateReputation({
    agentId,
    dimension: "reliability",
    score: 9000, // High score for successful response
    evidence,
  });

  // Accuracy is evaluated by downstream consumers (feedback loop)
  // Collaboration is evaluated during multi-agent tasks
}
