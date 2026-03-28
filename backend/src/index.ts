/**
 * Nexus Backend — Entry Point
 *
 * Express server exposing REST API for the Nexus AI Agent OS.
 * Connects to 0G Chain, Storage, Compute, and DA.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./api/routes";

dotenv.config();

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
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   Nexus AI Agent OS — Backend Server     ║
  ║   Network: 0G Mainnet (16661)            ║
  ║   Port: ${PORT}                              ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
