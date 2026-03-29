"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";
import { getStats, listAgents, listSkills } from "@/lib/api";

interface DashboardStats {
  totalAgents: number;
  totalSkills: number;
  activeSkills: number;
  network: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalAgents: 0, totalSkills: 0, activeSkills: 0, network: "—" });
  const [recentAgents, setRecentAgents] = useState<Array<{ id: number; skills: number }>>([]);
  const [recentSkills, setRecentSkills] = useState<Array<{ id: number; name: string; totalUses: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [statsRes, agentsRes, skillsRes] = await Promise.all([
        getStats().catch(() => ({ totalAgents: "0", totalSkills: "0", activeSkills: "0", network: "offline", chainId: 0 })),
        listAgents().catch(() => ({ success: false, agents: [] })),
        listSkills().catch(() => ({ success: false, skills: [] })),
      ]);

      setStats({
        totalAgents: Number(statsRes.totalAgents),
        totalSkills: Number(statsRes.totalSkills),
        activeSkills: Number(statsRes.activeSkills),
        network: statsRes.network,
      });

      setRecentAgents(
        agentsRes.agents.slice(-3).reverse().map((a) => ({ id: a.id, skills: a.skills.length }))
      );

      setRecentSkills(
        skillsRes.skills.slice(-3).reverse().map((s) => ({ id: s.id, name: s.name, totalUses: s.totalUses }))
      );
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-[14px] text-indigo-400">PLATFORM STATS <span className="font-pixel text-[8px] text-gray-500">(ON-CHAIN)</span></h2>
          <PixelButton onClick={loadDashboard} variant="secondary">↻ REFRESH</PixelButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "ACTIVE AGENTS", value: loading ? "..." : stats.totalAgents.toString(), icon: "🤖", color: "border-indigo-500" },
            { label: "SKILLS AVAILABLE", value: loading ? "..." : stats.totalSkills.toString(), icon: "⚡", color: "border-yellow-500" },
            { label: "ACTIVE SKILLS", value: loading ? "..." : stats.activeSkills.toString(), icon: "✅", color: "border-green-500" },
            { label: "NETWORK", value: loading ? "..." : stats.network, icon: "⛓️", color: "border-indigo-500" },
          ].map((stat) => (
            <PixelCard key={stat.label} borderColor={stat.color} className="pixel-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[6px] text-gray-400 uppercase">{stat.label}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="font-pixel text-[16px] text-white">{stat.value}</p>
            </PixelCard>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Agents */}
          <PixelCard borderColor="border-indigo-500" className="pixel-shadow">
            <h2 className="font-pixel text-[10px] text-indigo-400 mb-4">RECENT AGENTS <span className="font-pixel text-[6px] text-gray-500">(ON-CHAIN)</span></h2>
            <div className="space-y-3">
              {loading ? (
                <p className="font-pixel text-[8px] text-gray-500 animate-pulse">LOADING FROM CHAIN...</p>
              ) : recentAgents.length === 0 ? (
                <p className="font-pixel text-[8px] text-gray-500">NO AGENTS MINTED YET</p>
              ) : (
                recentAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className="flex items-center justify-between p-3 bg-gray-800/50 border-2 border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <p className="font-pixel text-[8px] text-white">AGENT #{agent.id}</p>
                      <p className="font-pixel text-[6px] text-gray-500 mt-1">INFT #{agent.id} · {agent.skills} SKILLS</p>
                    </div>
                    <span className="font-pixel text-[8px] text-gray-600">→</span>
                  </Link>
                ))
              )}
            </div>
            <Link href="/agents/create" className="mt-4 block text-center bg-indigo-600/20 border-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 px-4 py-2 font-pixel text-[8px] transition-colors">
              + CREATE AGENT
            </Link>
          </PixelCard>

          {/* Skill Marketplace Preview */}
          <PixelCard borderColor="border-yellow-500" className="pixel-shadow">
            <h2 className="font-pixel text-[10px] text-yellow-400 mb-4">SKILLS <span className="font-pixel text-[6px] text-gray-500">(ON-CHAIN)</span></h2>
            <div className="space-y-3">
              {loading ? (
                <p className="font-pixel text-[8px] text-gray-500 animate-pulse">LOADING FROM CHAIN...</p>
              ) : recentSkills.length === 0 ? (
                <p className="font-pixel text-[8px] text-gray-500">NO SKILLS CREATED YET</p>
              ) : (
                recentSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-800/50 border-2 border-gray-700">
                    <div>
                      <p className="font-pixel text-[8px] text-white">{skill.name.toUpperCase()}</p>
                      <p className="font-pixel text-[6px] text-gray-500 mt-1">INFT #{skill.id} · {skill.totalUses} USES</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/skills" className="mt-4 block text-center font-pixel text-[8px] text-gray-400 hover:text-white transition-colors">
              VIEW ALL SKILLS →
            </Link>
          </PixelCard>

          {/* Quick Actions */}
          <PixelCard borderColor="border-green-500" className="pixel-shadow">
            <h2 className="font-pixel text-[10px] text-green-400 mb-4">QUICK ACTIONS</h2>
            <div className="space-y-2">
              <Link href="/agents/create" className="block w-full bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 px-4 py-3 font-pixel text-[8px] text-center transition-colors pixel-shadow">
                🤖 CREATE AGENT
              </Link>
              <Link href="/skills" className="block w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 px-4 py-3 font-pixel text-[8px] text-center transition-colors">
                ⚡ BROWSE SKILLS
              </Link>
              <Link href="/interact" className="block w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 px-4 py-3 font-pixel text-[8px] text-center transition-colors">
                💬 CHAT WITH AGENT
              </Link>
              <Link href="/tasks" className="block w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 px-4 py-3 font-pixel text-[8px] text-center transition-colors">
                📋 CREATE TASK
              </Link>
              <Link href="/leaderboard" className="block w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 px-4 py-3 font-pixel text-[8px] text-center transition-colors">
                🏆 LEADERBOARD
              </Link>
            </div>
          </PixelCard>
        </div>
      </section>

      {/* 0G Integration Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-gradient-to-r from-indigo-950 to-purple-950 border-2 border-indigo-500/30 p-6 pixel-shadow">
          <h3 className="font-pixel text-[10px] text-indigo-400 mb-3">POWERED BY 0G INFRASTRUCTURE</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { name: "0G CHAIN", desc: "Smart contracts" },
              { name: "0G STORAGE", desc: "Agent memory" },
              { name: "0G COMPUTE", desc: "TeeML inference" },
              { name: "0G DA", desc: "Action proofs" },
              { name: "AGENT ID", desc: "ERC-7857 INFT" },
              { name: "ALIGNMENT", desc: "Safety monitor" },
            ].map((c) => (
              <div key={c.name} className="bg-black/20 border-2 border-indigo-500/20 p-2 text-center">
                <p className="font-pixel text-[6px] text-indigo-400">{c.name}</p>
                <p className="font-pixel text-[6px] text-gray-500 mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
