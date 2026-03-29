/**
 * REST API Routes
 *
 * Exposes Nexus functionality via HTTP endpoints.
 * Used by frontend dashboard and external integrations.
 */

import { Router, Request, Response } from "express";
import { uploadAgentMetadata, uploadSkillData } from "../services/storage";
import { runInference, executeSkill } from "../services/compute";
import { postActionProof } from "../services/da";
import { evaluateAndScore } from "../services/reputation";
import { analyzeAgentOutput } from "../services/safety";
import * as contracts from "../services/contracts";

const router = Router();

// ─── Agent Endpoints ─────────────────────────────────────

/** POST /api/agents/mint — Create a new agent */
router.post("/agents/mint", async (req: Request, res: Response) => {
  try {
    const { owner, model, config, capabilities } = req.body;

    // 1. Upload encrypted metadata to 0G Storage
    const storageResult = await uploadAgentMetadata(
      { model, config, capabilities, version: "1.0" },
      owner
    );

    // 2. Mint INFT on 0G Chain
    const mintResult = await contracts.mintAgent(
      owner,
      storageResult.encryptedURI,
      storageResult.metadataHash
    );

    res.json({
      success: true,
      tokenId: mintResult.tokenId?.toString(),
      txHash: mintResult.txHash,
      storageURI: storageResult.encryptedURI,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** GET /api/agents/list — List all agents from on-chain */
router.get("/agents/list", async (_req: Request, res: Response) => {
  try {
    const agents = await contracts.listAgents();
    const repContract = contracts.getReputationContract();

    // Enrich with reputation data
    const enriched = await Promise.all(
      agents.map(async (agent) => {
        try {
          const rep = await repContract.getReputation(agent.id);
          const composite = await repContract.getCompositeScore(agent.id);
          return {
            ...agent,
            reputation: {
              accuracy: rep[0].toString(),
              reliability: rep[1].toString(),
              safety: rep[2].toString(),
              collaboration: rep[3].toString(),
              totalActions: rep[4].toString(),
              compositeScore: composite.toString(),
            },
          };
        } catch {
          return {
            ...agent,
            reputation: { accuracy: "0", reliability: "0", safety: "0", collaboration: "0", totalActions: "0", compositeScore: "0" },
          };
        }
      })
    );

    res.json({ success: true, agents: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, agents: [] });
  }
});

/** GET /api/agents/:id — Get agent details */
router.get("/agents/:id", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.id);
    const contract = contracts.getAgentContract();
    const agent = await contract.getAgent(agentId);
    const repContract = contracts.getReputationContract();
    const reputation = await repContract.getReputation(agentId);
    const compositeScore = await repContract.getCompositeScore(agentId);

    res.json({
      id: agentId,
      encryptedURI: agent[0],
      metadataHash: agent[1],
      createdAt: agent[2].toString(),
      clonedFrom: agent[3].toString(),
      skills: agent[4],
      reputation: {
        accuracy: reputation[0].toString(),
        reliability: reputation[1].toString(),
        safety: reputation[2].toString(),
        collaboration: reputation[3].toString(),
        totalActions: reputation[4].toString(),
        compositeScore: compositeScore.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Skill Endpoints ─────────────────────────────────────

/** POST /api/skills/create — Create a new skill */
router.post("/skills/create", async (req: Request, res: Response) => {
  try {
    const { name, description, creator, weights, config, pricePerUse, subscriptionPrice } = req.body;

    // 1. Upload encrypted skill data to 0G Storage
    const storageResult = await uploadSkillData({ name, weights, config }, creator);

    // 2. Register skill on-chain
    const result = await contracts.createSkill(
      name,
      description,
      storageResult.encryptedURI,
      storageResult.metadataHash,
      BigInt(pricePerUse || "0"),
      BigInt(subscriptionPrice || "0")
    );

    res.json({ success: true, txHash: result.txHash, storageURI: storageResult.encryptedURI });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** GET /api/skills/list — List all skills from on-chain */
router.get("/skills/list", async (_req: Request, res: Response) => {
  try {
    const skills = await contracts.listSkills();
    res.json({ success: true, skills });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, skills: [] });
  }
});

/** GET /api/skills/:id — Get skill details */
router.get("/skills/:id", async (req: Request, res: Response) => {
  try {
    const skillId = parseInt(req.params.id);
    const contract = contracts.getSkillContract();
    const skill = await contract.getSkill(skillId);
    res.json({ id: skillId, ...skill });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Inference Endpoints ─────────────────────────────────

/** POST /api/inference — Run AI inference for an agent */
router.post("/inference", async (req: Request, res: Response) => {
  try {
    const { agentId, model, messages } = req.body;

    // 1. Run inference via 0G Compute
    const result = await runInference({ agentId, model, messages });

    // 2. Safety check
    const safetyReport = await analyzeAgentOutput(
      agentId,
      messages[messages.length - 1]?.content || "",
      result.output
    );

    // 3. Update reputation
    await evaluateAndScore(
      agentId,
      "inference",
      messages[messages.length - 1]?.content || "",
      result.output,
      model,
      result.verificationProof
    );

    res.json({
      success: true,
      output: result.output,
      verification: result.verificationProof,
      safety: safetyReport,
      cost: result.cost,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** POST /api/skills/execute — Execute a skill for an agent */
router.post("/skills/execute", async (req: Request, res: Response) => {
  try {
    const { agentId, skillId, input } = req.body;

    // Run skill inference
    const result = await executeSkill(agentId, skillId, input);

    // Safety check on output
    const safetyReport = await analyzeAgentOutput(agentId, input, result.output);

    // Update reputation
    await evaluateAndScore(
      agentId,
      `skill_${skillId}`,
      input,
      result.output,
      result.model,
      result.verificationProof
    );

    res.json({
      success: true,
      ...result,
      safety: safetyReport,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** GET /api/leaderboard — On-chain reputation leaderboard */
router.get("/leaderboard", async (_req: Request, res: Response) => {
  try {
    const entries = await contracts.getLeaderboard();
    res.json({ success: true, leaderboard: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, leaderboard: [] });
  }
});

/** GET /api/agents/:id/actions — On-chain action history (DA proofs) */
router.get("/agents/:id/actions", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.id);
    const actions = await contracts.getActionHistory(agentId);
    res.json({ success: true, actions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, actions: [] });
  }
});

/** GET /api/reputation/:agentId — Get agent reputation */
router.get("/reputation/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.agentId);
    const repContract = contracts.getReputationContract();
    const reputation = await repContract.getReputation(agentId);
    const compositeScore = await repContract.getCompositeScore(agentId);
    const actionCount = await repContract.getActionCount(agentId);

    res.json({
      agentId,
      accuracy: reputation[0].toString(),
      reliability: reputation[1].toString(),
      safety: reputation[2].toString(),
      collaboration: reputation[3].toString(),
      totalActions: reputation[4].toString(),
      lastUpdated: reputation[5].toString(),
      compositeScore: compositeScore.toString(),
      actionCount: actionCount.toString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** GET /api/stats — Platform statistics (on-chain) */
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await contracts.getPlatformStats();
    res.json({
      ...stats,
      network: process.env.OG_RPC_URL?.includes("testnet") ? "0G Galileo Testnet" : "0G Mainnet",
      chainId: process.env.OG_RPC_URL?.includes("testnet") ? 16602 : 16661,
    });
  } catch (error: any) {
    res.json({
      totalAgents: "0",
      totalSkills: "0",
      activeSkills: "0",
      network: process.env.OG_RPC_URL?.includes("testnet") ? "0G Galileo Testnet" : "0G Mainnet",
      chainId: process.env.OG_RPC_URL?.includes("testnet") ? 16602 : 16661,
      note: "Connect contracts to get live data",
    });
  }
});

// ─── Task/Escrow Endpoints ───────────────────────────────

/** GET /api/tasks/list — List all tasks from on-chain */
router.get("/tasks/list", async (_req: Request, res: Response) => {
  try {
    const tasks = await contracts.listTasks();
    res.json({ success: true, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, tasks: [] });
  }
});

/** POST /api/tasks/create — Create a new task with escrow */
router.post("/tasks/create", async (req: Request, res: Response) => {
  try {
    const { agentId, agentOwner, description, payment } = req.body;
    const contract = contracts.getEscrowContract();
    const tx = await contract.createTask(agentId, agentOwner, description, {
      value: BigInt(payment),
    });
    const receipt = await tx.wait();
    res.json({ success: true, txHash: receipt.hash });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Health ──────────────────────────────────────────────

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    network: process.env.OG_RPC_URL?.includes("testnet") ? "0G Galileo Testnet" : "0G Mainnet",
    chainId: process.env.OG_RPC_URL?.includes("testnet") ? 16602 : 16661,
    timestamp: Date.now(),
  });
});

export default router;
