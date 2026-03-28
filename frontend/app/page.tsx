"use client";

import Link from "next/link";
import { OG_EXPLORER } from "@/lib/constants";

const CONTRACTS = {
  agent: "0x0e8e941c363dc1C06DD0bC02395B775dE94B48a4",
  skill: "0xF24C4B0f45a46E2d761770BA75e147DEb738d3A6",
  reputation: "0x465291f35A3DC723B81349CBeBB296Cbf57AAAa3",
  escrow: "0x66f6f49B80d4F705AB1b8Fe8E6b2cA51846EBDE8",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ─── Nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
            <span className="text-lg font-bold tracking-tight">Nexus</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#0g" className="hover:text-white transition-colors">0G Stack</a>
            <a href={`${OG_EXPLORER}/address/${CONTRACTS.agent}`} target="_blank" className="hover:text-white transition-colors">Explorer ↗</a>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-6">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live on 0G Galileo Testnet
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            The OS for
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Birth agents as INFTs. Equip modular skills. Build on-chain reputation.
            All verified by 0G&apos;s decentralized compute — no gatekeepers, no black boxes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Launch App →
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 px-8 py-3.5 rounded-xl text-sm font-medium transition-colors"
            >
              View Code
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: "6", label: "0G Components" },
              { value: "4", label: "Smart Contracts" },
              { value: "29", label: "Tests Passing" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-indigo-400">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6 Layers ─────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">6 Layers. One OS.</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Every layer maps to a real 0G component — not just imported, architecturally essential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🪪", title: "Identity & Birth", desc: "Every agent gets an ERC-7857 INFT — encrypted brain, transferable, cloneable.", tag: "Agent ID" },
              { icon: "🧩", title: "Skill Composition", desc: "Modular skills as INFTs. Equip via AuthorizedUsage. Creators earn royalties.", tag: "OpenClaw + INFT" },
              { icon: "🧠", title: "Memory & State", desc: "Persistent memory across sessions. Log Layer (immutable) + KV Layer (mutable).", tag: "0G Storage" },
              { icon: "⚡", title: "Execution & Verification", desc: "All inference via TeeML — cryptographically proven, can't be faked.", tag: "0G Compute" },
              { icon: "📊", title: "Reputation & Trust", desc: "On-chain scores from verified action proofs. Accuracy, reliability, safety, collaboration.", tag: "0G DA + Chain" },
              { icon: "🛡️", title: "Safety & Alignment", desc: "Continuous monitoring for drift, anomalies, and harmful behavior.", tag: "AI Alignment" },
            ].map((layer) => (
              <div key={layer.title} className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 hover:border-indigo-600/40 transition-colors group">
                <div className="text-3xl mb-3">{layer.icon}</div>
                <h3 className="font-semibold mb-1">{layer.title}</h3>
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{layer.desc}</p>
                <span className="text-[10px] bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded-full">{layer.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Architecture ─────────────────────────────── */}
      <section id="architecture" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-400">From birth to monetization — the agent lifecycle on Nexus.</p>
          </div>

          <div className="space-y-0">
            {[
              { step: "01", title: "Create Agent", desc: "Define capabilities, choose AI model, set system prompt. Brain is encrypted and stored on 0G Storage.", color: "from-indigo-500" },
              { step: "02", title: "Mint INFT", desc: "Agent identity minted as ERC-7857 on 0G Chain. The INFT IS the agent — brain + identity in one token.", color: "from-purple-500" },
              { step: "03", title: "Equip Skills", desc: "Browse the skill marketplace. Pay per use or subscribe. Skills are also INFTs with encrypted weights.", color: "from-pink-500" },
              { step: "04", title: "Interact & Earn", desc: "Users chat with your agent. Every response runs on 0G Compute with TeeML verification. Reputation grows.", color: "from-amber-500" },
              { step: "05", title: "Trade or Clone", desc: "Sell your agent (brain + reputation transfers). Or clone it — fork with same intelligence.", color: "from-green-500" },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start py-6 border-b border-gray-800/50 last:border-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center text-sm font-bold shrink-0`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 0G Stack ─────────────────────────────────── */}
      <section id="0g" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Powered by 0G</h2>
            <p className="text-gray-400">Every component is architecturally essential — not just imported.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Chain", desc: "4 contracts deployed", id: "16602" },
              { name: "Storage", desc: "Agent memory + skills", id: "Log+KV" },
              { name: "Compute", desc: "TeeML inference", id: "DeepSeek" },
              { name: "DA", desc: "Action proofs", id: "Immutable" },
              { name: "Agent ID", desc: "ERC-7857 INFT", id: "Clone+Auth" },
              { name: "Alignment", desc: "Safety monitor", id: "Drift detect" },
            ].map((c) => (
              <div key={c.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-indigo-600/40 transition-colors">
                <p className="text-sm font-semibold text-indigo-400 mb-1">0G {c.name}</p>
                <p className="text-xs text-gray-400 mb-2">{c.desc}</p>
                <span className="text-[10px] text-gray-600">{c.id}</span>
              </div>
            ))}
          </div>

          {/* Contract addresses */}
          <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3 text-center">Deployed Contracts (Galileo Testnet)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { name: "NexusAgentINFT", addr: CONTRACTS.agent },
                { name: "SkillRegistry", addr: CONTRACTS.skill },
                { name: "ReputationEngine", addr: CONTRACTS.reputation },
                { name: "AgentEscrow", addr: CONTRACTS.escrow },
              ].map((c) => (
                <a
                  key={c.name}
                  href={`${OG_EXPLORER}/address/${c.addr}`}
                  target="_blank"
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-gray-400">{c.name}</span>
                  <span className="text-indigo-400">{c.addr.slice(0, 8)}...{c.addr.slice(-6)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vision ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI as a Public Good</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            0G&apos;s mission is to make AI accessible, transparent, and fair.
            Nexus builds on that vision — an open platform where anyone can create,
            own, and monetize AI agents without gatekeepers. Every action is verifiable.
            Every agent is sovereign.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Start Building →
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded" />
            <span className="text-sm font-semibold">Nexus</span>
            <span className="text-xs text-gray-600">AI Agent OS on 0G</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="https://docs.0g.ai" target="_blank" className="hover:text-white transition-colors">0G Docs</a>
            <a href={OG_EXPLORER} target="_blank" className="hover:text-white transition-colors">Explorer</a>
            <a href="https://faucet.0g.ai" target="_blank" className="hover:text-white transition-colors">Faucet</a>
            <span>Track 1: Agentic Infrastructure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
