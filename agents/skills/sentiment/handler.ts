/**
 * Sentiment Analysis Skill Handler
 *
 * Executes sentiment analysis via 0G Compute.
 * This is a reference implementation for how skills work in Nexus.
 */

import { runInference } from "../../../backend/src/services/compute";
import * as fs from "fs";
import * as path from "path";

const PROMPT = fs.readFileSync(path.join(__dirname, "prompt.md"), "utf-8");

export interface SentimentInput {
  text: string;
  context?: "general" | "crypto" | "defi" | "news";
}

export interface SentimentOutput {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  reasoning: string;
}

export async function execute(agentId: number, input: SentimentInput): Promise<SentimentOutput> {
  const result = await runInference({
    agentId,
    model: "deepseek-chat-v3-0324",
    messages: [
      { role: "system", content: PROMPT },
      {
        role: "user",
        content: `Context: ${input.context || "general"}\n\nText to analyze:\n${input.text}`,
      },
    ],
    temperature: 0.2,
  });

  try {
    return JSON.parse(result.output);
  } catch {
    return {
      sentiment: "neutral",
      confidence: 0.5,
      reasoning: "Failed to parse model output",
    };
  }
}
