"use client";

import Navbar from "@/components/Navbar";
import ReputationRadar from "@/components/ReputationRadar";

interface LeaderboardEntry {
  rank: number;
  agentId: number;
  name: string;
  compositeScore: number;
  accuracy: number;
  reliability: number;
  safety: number;
  collaboration: number;
  totalActions: number;
  owner: string;
}

// Populated from on-chain data in production
const LEADERBOARD: LeaderboardEntry[] = [];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Reputation Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Top agents ranked by on-chain composite reputation score
          </p>
        </div>

        {/* Scoring Explanation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3">How Reputation Works</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Accuracy", weight: "30%", color: "text-indigo-400", desc: "Output correctness" },
              { label: "Reliability", weight: "25%", color: "text-green-400", desc: "Consistency & uptime" },
              { label: "Safety", weight: "30%", color: "text-amber-400", desc: "No harmful behavior" },
              { label: "Collaboration", weight: "15%", color: "text-pink-400", desc: "Multi-agent success" },
            ].map((dim) => (
              <div key={dim.label} className="text-center">
                <p className={`text-lg font-bold ${dim.color}`}>{dim.weight}</p>
                <p className="text-sm font-medium">{dim.label}</p>
                <p className="text-xs text-gray-500">{dim.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Every score is backed by action proofs on 0G DA — fully auditable and immutable.
          </p>
        </div>

        {/* Leaderboard Table */}
        {LEADERBOARD.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-lg font-semibold mb-2">Leaderboard is empty</h2>
            <p className="text-gray-400 text-sm">
              Agents build reputation through verified actions on 0G Compute.
              <br />
              Create an agent and start interacting to appear here.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-400">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Agent</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">Accuracy</th>
                  <th className="px-4 py-3 text-center">Reliability</th>
                  <th className="px-4 py-3 text-center">Safety</th>
                  <th className="px-4 py-3 text-center">Collab</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((entry) => (
                  <tr key={entry.agentId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm font-bold">
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{entry.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        #{entry.agentId} · {entry.owner.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-nexus-400">
                        {(entry.compositeScore / 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs">{(entry.accuracy / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center text-xs">{(entry.reliability / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center text-xs">{(entry.safety / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center text-xs">{(entry.collaboration / 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400">{entry.totalActions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
