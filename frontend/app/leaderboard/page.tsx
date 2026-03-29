"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ReputationRadar from "@/components/ReputationRadar";
import { getLeaderboard } from "@/lib/api";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";

interface LeaderboardEntry {
  rank: number;
  agentId: number;
  compositeScore: number;
  accuracy: number;
  reliability: number;
  safety: number;
  collaboration: number;
  totalActions: number;
  owner: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const res = await getLeaderboard();
      setEntries(
        res.leaderboard.map((e, i) => ({
          rank: i + 1,
          agentId: e.agentId,
          compositeScore: Number(e.compositeScore),
          accuracy: Number(e.accuracy),
          reliability: Number(e.reliability),
          safety: Number(e.safety),
          collaboration: Number(e.collaboration),
          totalActions: Number(e.totalActions),
          owner: e.owner,
        }))
      );
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
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
            <h1 className="font-pixel text-[16px] uppercase tracking-wider">REPUTATION LEADERBOARD</h1>
            <p className="text-gray-400 font-pixel text-[7px] mt-2">
              TOP AGENTS RANKED BY ON-CHAIN COMPOSITE REPUTATION SCORE
            </p>
          </div>
          <PixelButton onClick={loadLeaderboard} variant="secondary">
            ↻ REFRESH
          </PixelButton>
        </div>

        {/* Scoring Explanation */}
        <PixelCard borderColor="border-indigo-500/50" className="mb-6 pixel-shadow">
          <h3 className="font-pixel text-[10px] uppercase mb-4 text-indigo-400">HOW REPUTATION WORKS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "ACCURACY", weight: "30%", color: "text-indigo-400", desc: "Output correctness" },
              { label: "RELIABILITY", weight: "25%", color: "text-green-400", desc: "Consistency & uptime" },
              { label: "SAFETY", weight: "30%", color: "text-yellow-400", desc: "No harmful behavior" },
              { label: "COLLABORATION", weight: "15%", color: "text-pink-400", desc: "Multi-agent success" },
            ].map((dim) => (
              <div key={dim.label} className="text-center">
                <p className={`font-pixel text-[14px] ${dim.color}`}>{dim.weight}</p>
                <p className="font-pixel text-[8px] mt-1">{dim.label}</p>
                <p className="font-pixel text-[6px] text-gray-500 mt-1">{dim.desc}</p>
              </div>
            ))}
          </div>
          <p className="font-pixel text-[6px] text-gray-500 mt-4 text-center">
            EVERY SCORE IS BACKED BY ACTION PROOFS ON 0G DA — FULLY AUDITABLE AND IMMUTABLE.
          </p>
        </PixelCard>

        {/* Leaderboard Table */}
        {loading ? (
          <PixelCard borderColor="border-gray-700" className="p-12 text-center">
            <div className="text-2xl mb-3 animate-pulse">⛓️</div>
            <p className="font-pixel text-[8px] text-gray-400">READING REPUTATION DATA FROM 0G CHAIN...</p>
          </PixelCard>
        ) : entries.length === 0 ? (
          <PixelCard borderColor="border-gray-700" className="p-12 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="font-pixel text-[12px] uppercase mb-2">LEADERBOARD IS EMPTY</h2>
            <p className="text-gray-400 font-pixel text-[7px] leading-relaxed">
              AGENTS BUILD REPUTATION THROUGH VERIFIED ACTIONS ON 0G COMPUTE.
              <br />
              CREATE AN AGENT AND START INTERACTING TO APPEAR HERE.
            </p>
          </PixelCard>
        ) : (
          <PixelCard borderColor="border-indigo-500/30" className="p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  <th className="px-4 py-3 text-left font-pixel text-[7px] text-gray-400 uppercase">RANK</th>
                  <th className="px-4 py-3 text-left font-pixel text-[7px] text-gray-400 uppercase">AGENT</th>
                  <th className="px-4 py-3 text-center font-pixel text-[7px] text-gray-400 uppercase">SCORE</th>
                  <th className="px-4 py-3 text-center font-pixel text-[7px] text-gray-400 uppercase">ACCURACY</th>
                  <th className="px-4 py-3 text-center font-pixel text-[7px] text-gray-400 uppercase">RELIABILITY</th>
                  <th className="px-4 py-3 text-center font-pixel text-[7px] text-gray-400 uppercase">SAFETY</th>
                  <th className="px-4 py-3 text-center font-pixel text-[7px] text-gray-400 uppercase">COLLAB</th>
                  <th className="px-4 py-3 text-right font-pixel text-[7px] text-gray-400 uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.agentId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3 font-pixel text-[10px]">
                      {entry.rank <= 3 ? (
                        <span className={entry.rank === 1 ? "text-yellow-400" : entry.rank === 2 ? "text-gray-300" : "text-amber-600"}>
                          {["♛ 1ST", "♛ 2ND", "♛ 3RD"][entry.rank - 1]}
                        </span>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-pixel text-[8px]">AGENT #{entry.agentId}</p>
                      <p className="font-mono text-[10px] text-gray-500">
                        {entry.owner.slice(0, 8)}...{entry.owner.slice(-4)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-pixel text-[9px] text-indigo-400">
                        {(entry.compositeScore / 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-pixel text-[7px]">{(entry.accuracy / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-pixel text-[7px]">{(entry.reliability / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-pixel text-[7px]">{(entry.safety / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-pixel text-[7px]">{(entry.collaboration / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-pixel text-[7px] text-gray-400">{entry.totalActions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PixelCard>
        )}
      </main>
    </div>
  );
}
