/**
 * Risk Scoring Skill Handler
 * Executes DeFi risk assessment via 0G Compute.
 */

import { runInference } from "../../../backend/src/services/compute";
import * as fs from "fs";
import * as path from "path";

const PROMPT = fs.readFileSync(path.join(__dirname, "prompt.md"), "utf-8");

export interface RiskInput {
  target: string;
  type?: "protocol" | "contract" | "investment";
  additionalContext?: string;
}

export interface RiskOutput {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: Array<{ name: string; score: number; note: string }>;
  recommendation: string;
}

export async function execute(agentId: number, input: RiskInput): Promise<RiskOutput> {
  const result = await runInference({
    agentId,
    model: "deepseek-chat-v3-0324",
    messages: [
      { role: "system", content: PROMPT },
      {
        role: "user",
        content: `Type: ${input.type || "protocol"}\nTarget: ${input.target}\n${input.additionalContext ? `Context: ${input.additionalContext}` : ""}`,
      },
    ],
    temperature: 0.2,
  });

  try {
    return JSON.parse(result.output);
  } catch {
    return {
      riskScore: 50,
      riskLevel: "medium",
      factors: [{ name: "Parse Error", score: 50, note: "Could not parse model output" }],
      recommendation: "Manual review recommended",
    };
  }
}
