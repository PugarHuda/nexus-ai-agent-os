"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";
import { listAgents } from "@/lib/api";
import NexMascot from "@/components/NexMascot";

interface AgentCard {
  id: number;
  owner: string;
  skills: string[];
  compositeScore: number;
  totalActions: number;
}

export default function AgentsPage() {
  const [filter, setFilter] = useState("all");
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setLoading(true);
    try {
      const res = await listAgents();
      setAgents(
        res.agents.map((a) => ({
          id: a.id,
          owner: a.owner,
          skills: a.skills,
          compositeScore: Number(a.reputation.compositeScore),
          totalActions: Number(a.reputation.totalActions),
        }))
      );
    } catch (err) {
      console.error("Failed to load agents from chain:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-pixel text-[16px] text-indigo-400">AGENT EXPLORER</h1>
            <p className="font-pixel text-[6px] text-gray-400 mt-2">
              BROWSE ALL AI AGENTS BORN IN NEXUS — DATA FETCHED ON-CHAIN
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PixelButton onClick={loadAgents} variant="secondary">↻ REFRESH</PixelButton>
            <Link href="/agents/create">
              <PixelButton variant="primary">+ CREATE AGENT</PixelButton>
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <PixelCard borderColor="border-indigo-500" className="p-12 text-center pixel-shadow">
            <NexMascot variant="think" size={48} animate />
            <p className="font-pixel text-[8px] text-gray-400">READING AGENTS FROM 0G CHAIN...</p>
          </PixelCard>
        ) : agents.length === 0 ? (
          <PixelCard borderColor="border-indigo-500" className="p-12 text-center pixel-shadow">
            <NexMascot variant="wave" size={64} />
            <h2 className="font-pixel text-[12px] text-white mb-2">NO AGENTS YET</h2>
            <p className="font-pixel text-[6px] text-gray-400 mb-4">
              CREATE YOUR FIRST AI AGENT TO GET STARTED. EACH AGENT GETS AN INFT
              IDENTITY ON 0G CHAIN WITH ENCRYPTED BRAIN STORED ON 0G STORAGE.
            </p>
            <Link href="/agents/create">
              <PixelButton variant="primary">CREATE FIRST AGENT</PixelButton>
            </Link>
          </PixelCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Link key={agent.id} href={`/agents/${agent.id}`}>
                <PixelCard borderColor="border-gray-700" hover className="pixel-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-pixel text-[6px] bg-gray-800 border-2 border-gray-600 px-2 py-1 text-gray-400">
                      INFT #{agent.id}
                    </span>
                    <span className="font-pixel text-[6px] text-gray-600 font-mono">
                      {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}
                    </span>
                  </div>
                  <h3 className="font-pixel text-[10px] text-white mb-1">AGENT #{agent.id}</h3>
                  <p className="font-pixel text-[6px] text-gray-500 mb-3">{agent.skills.length} SKILLS EQUIPPED</p>
                  <div className="flex items-center justify-between font-pixel text-[6px] text-gray-400">
                    <span>{agent.totalActions} ACTIONS</span>
                    <span className="text-green-400">
                      SCORE: {(agent.compositeScore / 100).toFixed(1)}%
                    </span>
                  </div>
                </PixelCard>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
