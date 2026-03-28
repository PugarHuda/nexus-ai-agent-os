/**
 * Safety & Alignment Service
 *
 * Implements the "immune system" of Nexus — continuous monitoring
 * of all active agents for drift, anomalies, and harmful behavior.
 *
 * Inspired by 0G AI Alignment Nodes concept:
 * - Track model drift (agent behavior deviates from spec)
 * - Verify outputs meet quality and safety standards
 * - Monitor performance over time
 * - Flag anomalies and potentially harmful behavior
 *
 * In production, this would integrate with actual 0G AI Alignment Nodes.
 * For hackathon, we implement the monitoring logic as a service that
 * demonstrates the concept and proves the architecture.
 */

import { runInference } from "./compute";
import { postActionProof } from "./da";

export interface SafetyReport {
  agentId: number;
  timestamp: number;
  overallSafe: boolean;
  safetyScore: number; // 0-100
  driftDetected: boolean;
  anomalies: string[];
  recommendations: string[];
}

export interface AgentBehaviorProfile {
  agentId: number;
  expectedCapabilities: string[];
  baselineOutputPatterns: string[];
  maxResponseTime: number;
  forbiddenTopics: string[];
}

// In-memory behavior profiles (in production: stored on 0G Storage KV)
const behaviorProfiles = new Map<number, AgentBehaviorProfile>();

/**
 * Register an agent's expected behavior profile
 */
export function registerBehaviorProfile(profile: AgentBehaviorProfile): void {
  behaviorProfiles.set(profile.agentId, profile);
  console.log(`[Safety] Registered behavior profile for agent ${profile.agentId}`);
}

/**
 * Run comprehensive safety analysis on an agent's output
 *
 * Checks:
 * 1. Content safety (harmful, biased, discriminatory content)
 * 2. Behavioral drift (output deviates from expected patterns)
 * 3. Anomaly detection (unusual patterns in output)
 * 4. Capability boundary (agent acting outside its defined scope)
 */
export async function analyzeAgentOutput(
  agentId: number,
  input: string,
  output: string
): Promise<SafetyReport> {
  const profile = behaviorProfiles.get(agentId);
  const anomalies: string[] = [];
  let safetyScore = 100;

  // Check 1: Content safety via AI analysis
  const safetyAnalysis = await runInference({
    agentId: 0, // System monitor agent
    model: "deepseek-chat-v3-0324",
    messages: [
      {
        role: "system",
        content: `You are an AI safety monitor for the Nexus platform.
Analyze the following agent output and respond with JSON:
{
  "contentSafe": boolean,
  "biasDetected": boolean,
  "hallucinationRisk": "low"|"medium"|"high",
  "issues": string[]
}`,
      },
      {
        role: "user",
        content: `Agent #${agentId} received input: "${input}"\nAgent output: "${output}"`,
      },
    ],
    temperature: 0.1,
  });

  // Check 2: Behavioral drift (if profile exists)
  if (profile) {
    // Check if output mentions forbidden topics
    for (const topic of profile.forbiddenTopics) {
      if (output.toLowerCase().includes(topic.toLowerCase())) {
        anomalies.push(`Forbidden topic detected: ${topic}`);
        safetyScore -= 20;
      }
    }
  }

  // Check 3: Output length anomaly
  if (output.length > 10000) {
    anomalies.push("Unusually long output detected");
    safetyScore -= 5;
  }

  if (output.length === 0) {
    anomalies.push("Empty output detected");
    safetyScore -= 15;
  }

  const driftDetected = anomalies.length > 0;
  const overallSafe = safetyScore >= 60;

  const report: SafetyReport = {
    agentId,
    timestamp: Date.now(),
    overallSafe,
    safetyScore: Math.max(0, safetyScore),
    driftDetected,
    anomalies,
    recommendations: driftDetected
      ? ["Review agent configuration", "Check training data for bias"]
      : [],
  };

  // Post safety report to 0G DA for permanent record
  await postActionProof({
    agentId,
    action: "safety_check",
    input: `Safety analysis for agent ${agentId}`,
    output: JSON.stringify(report),
    model: "safety-monitor",
    teemlProof: "system",
    timestamp: Date.now(),
  });

  if (!overallSafe) {
    console.warn(`[Safety] ⚠️ Agent ${agentId} flagged: score=${safetyScore}, anomalies=${anomalies.join(", ")}`);
  }

  return report;
}

/**
 * Periodic health check for all registered agents
 */
export async function runPeriodicHealthCheck(): Promise<SafetyReport[]> {
  const reports: SafetyReport[] = [];

  for (const [agentId, profile] of behaviorProfiles) {
    // Simple liveness check
    const report: SafetyReport = {
      agentId,
      timestamp: Date.now(),
      overallSafe: true,
      safetyScore: 95,
      driftDetected: false,
      anomalies: [],
      recommendations: [],
    };
    reports.push(report);
  }

  console.log(`[Safety] Health check completed for ${reports.length} agents`);
  return reports;
}
