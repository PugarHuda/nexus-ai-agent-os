"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Agents", value: "3", icon: "🤖" },
            { label: "Skills Available", value: "3", icon: "⚡" },
            { label: "Tasks Completed", value: "0", icon: "✅" },
            { label: "Total Revenue", value: "0 0G", icon: "💰" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Agents */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Recent Agents</h2>
            <div className="space-y-3">
              {[
                { id: 1, name: "Nexus Analyst", model: "deepseek-v3" },
                { id: 2, name: "Nexus Coder", model: "gpt-oss-120b" },
                { id: 3, name: "Nexus Coordinator", model: "deepseek-v3" },
              ].map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">#{agent.id} · {agent.model}</p>
                  </div>
                  <span className="text-xs text-gray-600">→</span>
                </Link>
              ))}
            </div>
            <Link href="/agents/create" className="mt-4 block text-center bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-4 py-2 rounded-lg text-sm transition-colors">
              + Create Agent
            </Link>
          </div>

          {/* Skill Marketplace Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Popular Skills</h2>
            <div className="space-y-3">
              {[
                { name: "Sentiment Analysis", uses: 0, price: "0.001 0G" },
                { name: "Risk Scoring", uses: 0, price: "0.005 0G" },
                { name: "Code Review", uses: 0, price: "0.01 0G" },
              ].map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{skill.name}</p>
                    <p className="text-xs text-gray-500">{skill.uses} uses</p>
                  </div>
                  <span className="text-xs text-green-400">{skill.price}</span>
                </div>
              ))}
            </div>
            <Link href="/skills" className="mt-4 block text-center text-gray-400 hover:text-white text-sm transition-colors">
              View All Skills →
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/agents/create" className="block w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors">
                🤖 Create Agent
              </Link>
              <Link href="/skills" className="block w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors">
                ⚡ Browse Skills
              </Link>
              <Link href="/interact" className="block w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors">
                💬 Chat with Agent
              </Link>
              <Link href="/tasks" className="block w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors">
                📋 Create Task
              </Link>
              <Link href="/leaderboard" className="block w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors">
                🏆 Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 0G Integration Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-800/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-3">Powered by 0G Infrastructure</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
            {[
              { name: "0G Chain", desc: "Smart contracts" },
              { name: "0G Storage", desc: "Agent memory" },
              { name: "0G Compute", desc: "TeeML inference" },
              { name: "0G DA", desc: "Action proofs" },
              { name: "Agent ID", desc: "ERC-7857 INFT" },
              { name: "Alignment", desc: "Safety monitor" },
            ].map((c) => (
              <div key={c.name} className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-indigo-400 font-medium">{c.name}</p>
                <p className="text-gray-500 text-[10px]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
