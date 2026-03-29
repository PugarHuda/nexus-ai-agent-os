"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";
import ReputationRadar from "@/components/ReputationRadar";
import { getAgent, getActionHistory } from "@/lib/api";
import { OG_EXPLORER } from "@/lib/constants";

interface AgentData {
  id: number;
  owner: string;
  encryptedURI: string;
  metadataHash: string;
  createdAt: string;
  clonedFrom: string;
  skills: string[];
  reputation: {
    accuracy: number;
    reliability: number;
    safety: number;
    collaboration: number;
    totalActions: number;
    compositeScore: number;
  };
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [actions, setActions] = useState<Array<{ dimension: number; score: number; daProofHash: string; timestamp: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAgent();
  }, [agentId]);

  async function loadAgent() {
    setLoading(true);
    setError("");
    try {
      const res = await getAgent(parseInt(agentId));
      setAgent({
        ...res,
        reputation: {
          accuracy: Number(res.reputation.accuracy),
          reliability: Number(res.reputation.reliability),
          safety: Number(res.reputation.safety),
          collaboration: Number(res.reputation.collaboration),
          totalActions: Number(res.reputation.totalActions),
          compositeScore: Number(res.reputation.compositeScore),
        },
      });
      // Load action history
      try {
        const actionsRes = await getActionHistory(parseInt(agentId));
        setActions(actionsRes.actions);
      } catch { /* no actions yet */ }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="font-pixel text-[16px] mb-3 animate-pixel-pulse">⛓️</div>
          <p className="font-pixel text-[8px] text-gray-400">READING AGENT #{agentId} FROM 0G CHAIN...</p>
        </main>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="font-pixel text-[8px] text-red-400">FAILED TO LOAD AGENT: {error}</p>
          <Link href="/agents" className="font-pixel text-[8px] text-gray-400 hover:text-white mt-2 inline-block">← BACK TO AGENTS</Link>
        </main>
      </div>
    );
  }

  const createdDate = agent.createdAt !== "0"
    ? new Date(Number(agent.createdAt) * 1000).toLocaleDateString()
    : "—";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/agents" className="font-pixel text-[8px] text-gray-400 hover:text-white mb-4 inline-block">← BACK TO AGENTS</Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-pixel text-[16px] text-indigo-400">AGENT #{agent.id}</h1>
            <p className="font-pixel text-[6px] text-gray-400 mt-2">
              INFT #{agent.id} · OWNER: {agent.owner.slice(0, 8)}...{agent.owner.slice(-6)}
            </p>
          </div>
          <div className="flex gap-2">
            <PixelButton variant="primary">CLONE AGENT</PixelButton>
            <Link href={`/interact?agent=${agent.id}`}>
              <PixelButton variant="secondary">CHAT</PixelButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reputation */}
          <PixelCard borderColor="border-indigo-500" className="pixel-shadow">
            <h2 className="font-pixel text-[10px] text-indigo-400 mb-4">ON-CHAIN REPUTATION</h2>
            <ReputationRadar
              accuracy={agent.reputation.accuracy}
              reliability={agent.reputation.reliability}
              safety={agent.reputation.safety}
              collaboration={agent.reputation.collaboration}
            />
            <div className="mt-4 text-center">
              <p className="font-pixel text-[6px] text-gray-500">{agent.reputation.totalActions} VERIFIED ACTIONS</p>
              <p className="font-pixel text-[14px] text-indigo-400 mt-1">
                {(agent.reputation.compositeScore / 100).toFixed(1)}%
              </p>
              <p className="font-pixel text-[6px] text-gray-500 mt-1">COMPOSITE SCORE</p>
            </div>
          </PixelCard>

          {/* Info */}
          <div className="space-y-4">
            <PixelCard borderColor="border-green-500" className="pixel-shadow">
              <h2 className="font-pixel text-[10px] text-green-400 mb-3">ON-CHAIN DETAILS</h2>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="font-pixel text-[6px] text-gray-400">TOKEN ID</span><span className="font-pixel text-[8px] font-mono text-white">#{agent.id}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="font-pixel text-[6px] text-gray-400">CREATED</span><span className="font-pixel text-[8px] text-white">{createdDate}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-2"><span className="font-pixel text-[6px] text-gray-400">CLONED FROM</span><span className="font-pixel text-[8px] text-white">{agent.clonedFrom === "0" ? "ORIGINAL" : `#${agent.clonedFrom}`}</span></div>
                <div className="flex justify-between"><span className="font-pixel text-[6px] text-gray-400">STORAGE URI</span><span className="font-pixel text-[6px] font-mono text-white truncate max-w-[200px]">{agent.encryptedURI}</span></div>
              </div>
            </PixelCard>

            <PixelCard borderColor="border-yellow-500" className="pixel-shadow">
              <h2 className="font-pixel text-[10px] text-yellow-400 mb-3">EQUIPPED SKILLS</h2>
              {agent.skills.length === 0 ? (
                <p className="font-pixel text-[6px] text-gray-500">NO SKILLS EQUIPPED YET</p>
              ) : (
                <div className="space-y-2">
                  {agent.skills.map((s: string, i: number) => (
                    <div key={i} className="bg-gray-800/50 border-2 border-gray-700 px-3 py-2 font-pixel text-[8px] text-white">{s}</div>
                  ))}
                </div>
              )}
              <Link href="/skills" className="mt-3 block font-pixel text-[8px] text-indigo-400 hover:text-indigo-300">+ EQUIP FROM MARKETPLACE</Link>
            </PixelCard>
          </div>
        </div>

        {/* Action History from On-Chain */}
        <div className="mt-6">
          <PixelCard borderColor="border-indigo-500" className="pixel-shadow">
            <h2 className="font-pixel text-[10px] text-indigo-400 mb-3">ACTION HISTORY <span className="font-pixel text-[6px] text-gray-500">(0G DA PROOFS — ON-CHAIN)</span></h2>
            {actions.length === 0 ? (
              <p className="font-pixel text-[6px] text-gray-500">NO ACTIONS RECORDED YET. INTERACT WITH THIS AGENT TO BUILD ITS ON-CHAIN HISTORY.</p>
            ) : (
              <div className="space-y-2">
                {actions.map((action, i) => {
                  const dimLabels = ["ACCURACY", "RELIABILITY", "SAFETY", "COLLABORATION"];
                  const dimColors = ["text-indigo-400", "text-green-400", "text-yellow-400", "text-pink-400"];
                  return (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 border-2 border-gray-700 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className={`font-pixel text-[6px] ${dimColors[action.dimension]}`}>{dimLabels[action.dimension]}</span>
                        <span className="font-pixel text-[8px] text-white">{(action.score / 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`${OG_EXPLORER}/tx/${action.daProofHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-pixel text-[6px] text-indigo-400 hover:text-indigo-300 font-mono"
                        >
                          {action.daProofHash.slice(0, 10)}... ↗
                        </a>
                        <span className="font-pixel text-[6px] text-gray-600">{new Date(Number(action.timestamp) * 1000).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PixelCard>
        </div>
      </main>
    </div>
  );
}
