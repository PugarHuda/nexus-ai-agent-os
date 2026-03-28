/**
 * Code Review Skill Handler
 * Executes automated code review via 0G Compute.
 */

import { runInference } from "../../../backend/src/services/compute";
import * as fs from "fs";
import * as path from "path";

const PROMPT = fs.readFileSync(path.join(__dirname, "prompt.md"), "utf-8");

export interface CodeReviewInput {
  code: string;
  language?: "solidity" | "typescript" | "python";
  focus?: "security" | "gas" | "bugs" | "all";
}

export interface CodeReviewOutput {
  issues: Array<{ line?: number; severity: string; type: string; description: string }>;
  severity: "clean" | "low" | "medium" | "high" | "critical";
  suggestions: string[];
  gasOptimizations: string[];
}

export async function execute(agentId: number, input: CodeReviewInput): Promise<CodeReviewOutput> {
  const result = await runInference({
    agentId,
    model: "gpt-oss-120b",
    messages: [
      { role: "system", content: PROMPT },
      {
        role: "user",
        content: `Language: ${input.language || "solidity"}\nFocus: ${input.focus || "all"}\n\nCode:\n\`\`\`\n${input.code.slice(0, 8000)}\n\`\`\``,
      },
    ],
    temperature: 0.1,
    maxTokens: 4096,
  });

  try {
    return JSON.parse(result.output);
  } catch {
    return {
      issues: [],
      severity: "clean",
      suggestions: ["Could not parse model output — manual review recommended"],
      gasOptimizations: [],
    };
  }
}
