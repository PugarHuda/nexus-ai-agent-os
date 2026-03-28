"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface AgentCard {
  id: number;
  name: string;
  category: string;
  model: string;
  skills: number;
  compositeScore: number;
  totalActions: number;
}

// Placeholder data — replaced by contract reads in production
const SAMPLE_AGENTS: AgentCard[] = [];

export default function AgentsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Agent Explorer</h1>
            <p className="text-gray-400 text-sm mt-1">
              Browse all AI agents born in Nexus
            </p>
          </div>
          <Link
            href="/agents/create"
            className="bg-nexus-600 hover:bg-nexus-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Create Agent
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "analysis", "development", "orchestration"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === f
                  ? "bg-nexus-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Agent Grid */}
        {SAMPLE_AGENTS.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-lg font-semibold mb-2">No agents yet</h2>
            <p className="text-gray-400 text-sm mb-4">
              Create your first AI agent to get started. Each agent gets an INFT
              identity on 0G Chain with encrypted brain stored on 0G Storage.
            </p>
            <Link
              href="/agents/create"
              className="inline-block bg-nexus-600 hover:bg-nexus-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create First Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_AGENTS.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-nexus-600/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                    #{agent.id}
                  </span>
                  <span className="text-xs text-nexus-400">{agent.category}</span>
                </div>
                <h3 className="font-semibold mb-1">{agent.name}</h3>
                <p className="text-xs text-gray-500 mb-3">Model: {agent.model}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{agent.skills} skills</span>
                  <span>{agent.totalActions} actions</span>
                  <span className="text-green-400">
                    Score: {(agent.compositeScore / 100).toFixed(1)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
