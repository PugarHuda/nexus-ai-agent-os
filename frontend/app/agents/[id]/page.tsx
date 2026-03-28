"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ReputationRadar from "@/components/ReputationRadar";

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;

  // In production: fetch from API / contract
  const agent = {
    id: parseInt(agentId),
    name: `Agent #${agentId}`,
    model: "deepseek-chat-v3-0324",
    createdAt: "—",
    clonedFrom: 0,
    skills: [] as string[],
    reputation: { accuracy: 0, reliability: 0, safety: 0, collaboration: 0, totalActions: 0, compositeScore: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/agents" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">← Back to Agents</Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-gray-400 text-sm mt-1">INFT #{agent.id} · Model: {agent.model}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-nexus-600 hover:bg-nexus-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Clone Agent</button>
            <Link href={`/interact?agent=${agent.id}`} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Chat</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reputation */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Reputation</h2>
            <ReputationRadar
              accuracy={agent.reputation.accuracy}
              reliability={agent.reputation.reliability}
              safety={agent.reputation.safety}
              collaboration={agent.reputation.collaboration}
            />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">{agent.reputation.totalActions} verified actions</p>
              <p className="text-lg font-bold text-nexus-400 mt-1">
                Composite: {(agent.reputation.compositeScore / 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-3">Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Token ID</span><span className="font-mono">#{agent.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Model</span><span>{agent.model}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Created</span><span>{agent.createdAt}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Cloned From</span><span>{agent.clonedFrom || "Original"}</span></div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-3">Equipped Skills</h2>
              {agent.skills.length === 0 ? (
                <p className="text-xs text-gray-500">No skills equipped yet</p>
              ) : (
                <div className="space-y-2">
                  {agent.skills.map((s, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg px-3 py-2 text-sm">{s}</div>
                  ))}
                </div>
              )}
              <Link href="/skills" className="mt-3 block text-xs text-nexus-400 hover:text-nexus-300">+ Equip from Marketplace</Link>
            </div>
          </div>
        </div>

        {/* Action History */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3">Action History (0G DA Proofs)</h2>
          <p className="text-xs text-gray-500">No actions recorded yet. Interact with this agent to build its on-chain history.</p>
        </div>
      </main>
    </div>
  );
}
