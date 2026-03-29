"use client";

import Link from "next/link";
import { OG_EXPLORER, CONTRACTS } from "@/lib/constants";
import PixelHero3D from "@/components/PixelHero3D";
import NexMascot from "@/components/NexMascot";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines z-50" />

      {/* Grid bg */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* ─── Nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-40 bg-gray-950/90 backdrop-blur-sm border-b-4 border-orange-500">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-orange-500 pixel-shadow" />
            <span className="font-pixel text-[10px] tracking-wider text-orange-400">NEXUS</span>
          </div>
          <div className="hidden md:flex items-center gap-6 font-pixel text-[7px] text-gray-400">
            <a href="#features" className="hover:text-orange-400 transition-colors">FEATURES</a>
            <a href="#how" className="hover:text-orange-400 transition-colors">HOW IT WORKS</a>
            <a href="#0g" className="hover:text-orange-400 transition-colors">0G STACK</a>
            <a href={`${OG_EXPLORER}/address/${CONTRACTS.agentINFT}`} target="_blank" className="hover:text-orange-400 transition-colors">EXPLORER ↗</a>
          </div>
          <Link href="/dashboard" className="bg-orange-600 hover:bg-orange-500 border-2 border-orange-400 px-4 py-2 font-pixel text-[7px] pixel-shadow transition-colors">
            LAUNCH APP
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-900 border-2 border-green-500 px-3 py-1.5 font-pixel text-[7px] text-green-400 mb-6">
              <div className="w-2 h-2 bg-green-500 animate-pulse" />
              LIVE ON 0G GALILEO TESTNET
            </div>

            <h1 className="font-pixel text-xl md:text-3xl leading-[1.8] mb-6">
              <span className="text-orange-400">THE OS</span>
              <br />
              <span className="text-white">FOR AI</span>
              <br />
              <span className="text-indigo-400">AGENTS</span>
            </h1>

            <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-md">
              Birth agents as INFTs. Equip modular skills. Build on-chain reputation.
              All verified by 0G&apos;s decentralized compute — no gatekeepers.
            </p>

            <div className="flex items-center gap-3 mb-10">
              <Link href="/dashboard" className="bg-orange-600 hover:bg-orange-500 border-2 border-orange-400 px-6 py-3 font-pixel text-[8px] pixel-shadow transition-colors">
                ▶ START
              </Link>
              <a href="https://github.com/PugarHuda/nexus-ai-agent-os" target="_blank" className="bg-gray-900 hover:bg-gray-800 border-2 border-gray-600 px-6 py-3 font-pixel text-[8px] transition-colors">
                {'<>'} CODE
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { value: "6", label: "0G PARTS", color: "text-indigo-400" },
                { value: "4", label: "CONTRACTS", color: "text-orange-400" },
                { value: "29", label: "TESTS OK", color: "text-green-400" },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`font-pixel text-xl ${s.color}`}>{s.value}</p>
                  <p className="font-pixel text-[6px] text-gray-600 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Hero */}
          <div className="flex justify-center">
            <PixelHero3D />
          </div>
        </div>
      </section>

      {/* ─── Meet Nex banner ──────────────────────────── */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto bg-gray-900 border-2 border-orange-500/30 p-6 flex items-center gap-6 pixel-shadow">
          <NexMascot variant="wave" size={80} animate />
          <div>
            <h3 className="font-pixel text-[10px] text-orange-400 mb-2">MEET NEX — YOUR AI AGENT COMPANION</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nex is a robot fox — part organic intelligence, part machine precision.
              Every agent born in Nexus carries Nex&apos;s spirit: autonomous, verifiable, and unstoppable.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6 Layers ─────────────────────────────────── */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg text-orange-400 mb-3">6 LAYERS. ONE OS.</h2>
            <p className="text-gray-400 text-sm">Every layer maps to a real 0G component.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: "🪪", title: "IDENTITY", desc: "ERC-7857 INFT — encrypted brain, transferable, cloneable.", tag: "Agent ID", color: "border-orange-500" },
              { icon: "🧩", title: "SKILLS", desc: "Modular skills as INFTs. Equip via AuthorizedUsage.", tag: "OpenClaw", color: "border-purple-500" },
              { icon: "🧠", title: "MEMORY", desc: "Log Layer (immutable) + KV Layer (mutable).", tag: "0G Storage", color: "border-blue-500" },
              { icon: "⚡", title: "EXECUTION", desc: "TeeML verified inference — can't be faked.", tag: "0G Compute", color: "border-yellow-500" },
              { icon: "📊", title: "REPUTATION", desc: "On-chain scores from verified action proofs.", tag: "0G DA+Chain", color: "border-green-500" },
              { icon: "🛡️", title: "SAFETY", desc: "Drift detection, anomaly monitoring.", tag: "Alignment", color: "border-red-500" },
            ].map((layer) => (
              <div key={layer.title} className={`bg-gray-900 border-2 ${layer.color} p-5 hover:bg-gray-800/50 transition-colors pixel-shadow`}>
                <div className="text-2xl mb-2">{layer.icon}</div>
                <h3 className="font-pixel text-[9px] text-white mb-2">{layer.title}</h3>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{layer.desc}</p>
                <span className="font-pixel text-[6px] text-gray-600 bg-gray-800 border border-gray-700 px-2 py-1">{layer.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────── */}
      <section id="how" className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-pixel text-lg text-orange-400 mb-10 text-center">HOW IT WORKS</h2>

          <div className="space-y-0">
            {[
              { step: "01", title: "CREATE AGENT", desc: "Define capabilities, choose AI model. Brain encrypted on 0G Storage.", color: "text-orange-400", border: "border-orange-500" },
              { step: "02", title: "MINT INFT", desc: "Agent identity minted as ERC-7857 on 0G Chain. The INFT IS the agent.", color: "text-indigo-400", border: "border-indigo-500" },
              { step: "03", title: "EQUIP SKILLS", desc: "Browse marketplace. Pay per use or subscribe. Skills are also INFTs.", color: "text-pink-400", border: "border-pink-500" },
              { step: "04", title: "INTERACT", desc: "Users chat with your agent. TeeML verified. Reputation grows.", color: "text-yellow-400", border: "border-yellow-500" },
              { step: "05", title: "TRADE/CLONE", desc: "Sell your agent or clone it. Brain + reputation transfers.", color: "text-green-400", border: "border-green-500" },
            ].map((item) => (
              <div key={item.step} className={`flex gap-4 items-start py-5 border-l-4 ${item.border} pl-4 mb-2`}>
                <div className={`font-pixel text-sm ${item.color} w-8 shrink-0`}>{item.step}</div>
                <div>
                  <h3 className="font-pixel text-[9px] text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 0G Stack ─────────────────────────────────── */}
      <section id="0g" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-pixel text-lg text-orange-400 mb-10 text-center">POWERED BY 0G</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { name: "CHAIN", desc: "4 contracts", color: "border-indigo-500", bg: "bg-indigo-950/30" },
              { name: "STORAGE", desc: "Agent memory", color: "border-blue-500", bg: "bg-blue-950/30" },
              { name: "COMPUTE", desc: "TeeML", color: "border-yellow-500", bg: "bg-yellow-950/30" },
              { name: "DA", desc: "Action proofs", color: "border-green-500", bg: "bg-green-950/30" },
              { name: "AGENT ID", desc: "ERC-7857", color: "border-orange-500", bg: "bg-orange-950/30" },
              { name: "ALIGN", desc: "Safety", color: "border-red-500", bg: "bg-red-950/30" },
            ].map((c) => (
              <div key={c.name} className={`${c.bg} border-2 ${c.color} p-3 text-center pixel-shadow`}>
                <p className="font-pixel text-[7px] text-white mb-1">{c.name}</p>
                <p className="text-[10px] text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Contracts */}
          <div className="mt-6 bg-gray-900 border-2 border-gray-700 p-4 pixel-shadow">
            <h3 className="font-pixel text-[8px] mb-3 text-center text-gray-400">DEPLOYED CONTRACTS (GALILEO TESTNET)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px]">
              {[
                { name: "AgentINFT", addr: CONTRACTS.agentINFT },
                { name: "SkillReg", addr: CONTRACTS.skillRegistry },
                { name: "Reputation", addr: CONTRACTS.reputation },
                { name: "Escrow", addr: CONTRACTS.escrow },
              ].map((c) => (
                <a key={c.name} href={`${OG_EXPLORER}/address/${c.addr}`} target="_blank"
                  className="flex items-center justify-between bg-gray-800/50 border border-gray-700 px-3 py-2 hover:border-orange-500/50 transition-colors">
                  <span className="text-gray-500">{c.name}</span>
                  <span className="text-orange-400">{c.addr ? `${c.addr.slice(0, 8)}...${c.addr.slice(-6)}` : "—"}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <NexMascot variant="idle" size={80} className="mb-4" />
          <h2 className="font-pixel text-lg text-orange-400 mb-4">AI AS A PUBLIC GOOD</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            An open platform where anyone can create, own, and monetize AI agents.
            Every action is verifiable. Every agent is sovereign.
          </p>
          <Link href="/dashboard" className="inline-block bg-orange-600 hover:bg-orange-500 border-2 border-orange-400 px-8 py-3 font-pixel text-[9px] pixel-shadow transition-colors">
            ▶ START BUILDING
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="border-t-4 border-gray-800 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500" />
            <span className="font-pixel text-[8px] text-orange-400">NEXUS</span>
            <span className="text-[10px] text-gray-600">AI Agent OS on 0G</span>
          </div>
          <div className="flex items-center gap-6 font-pixel text-[6px] text-gray-600">
            <a href="https://docs.0g.ai" target="_blank" className="hover:text-white transition-colors">0G DOCS</a>
            <a href={OG_EXPLORER} target="_blank" className="hover:text-white transition-colors">EXPLORER</a>
            <a href="https://faucet.0g.ai" target="_blank" className="hover:text-white transition-colors">FAUCET</a>
            <span>TRACK 1: AGENTIC INFRA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
