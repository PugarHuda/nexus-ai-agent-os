/**
 * Nexus Backend — Entry Point
 *
 * Express server exposing REST API for the Nexus AI Agent OS.
 * Connects to 0G Chain, Storage, Compute, and DA.
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./api/routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// API routes
app.use("/api", routes);

// Root
app.get("/", (_req, res) => {
  res.json({
    name: "Nexus — Decentralized AI Agent OS",
    version: "1.0.0",
    network: "0G Mainnet (Chain ID: 16661)",
    endpoints: {
      agents: "/api/agents",
      skills: "/api/skills",
      inference: "/api/inference",
      tasks: "/api/tasks",
      health: "/api/health",
    },
  });
});

app.listen(PORT, () => {
  const isTestnet = process.env.OG_RPC_URL?.includes("testnet");
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   Nexus AI Agent OS — Backend Server     ║
  ║   Network: ${isTestnet ? "0G Galileo Testnet" : "0G Mainnet (16661)"}${isTestnet ? "       " : ""}║
  ║   Port: ${PORT}                              ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
