"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { createSkill } from "@/lib/api";
import { getCurrentAccount } from "@/lib/wallet";

interface SkillItem {
  id: number;
  name: string;
  description: string;
  category: string;
  pricePerUse: string;
  subscriptionPrice: string;
  totalUses: number;
  creator: string;
}

const SAMPLE_SKILLS: SkillItem[] = [
  { id: 1, name: "Sentiment Analysis", description: "Analyzes text sentiment with crypto/DeFi context support", category: "analysis", pricePerUse: "0.001 0G", subscriptionPrice: "0.1 0G/mo", totalUses: 0, creator: "Nexus Team" },
  { id: 2, name: "Risk Scoring", description: "Evaluates risk level of DeFi protocols and smart contracts", category: "defi", pricePerUse: "0.005 0G", subscriptionPrice: "0.5 0G/mo", totalUses: 0, creator: "Nexus Team" },
  { id: 3, name: "Code Review", description: "Automated Solidity code review — bugs, security, gas optimization", category: "development", pricePerUse: "0.01 0G", subscriptionPrice: "1.0 0G/mo", totalUses: 0, creator: "Nexus Team" },
];

const CATEGORIES = ["analysis", "defi", "development", "orchestration", "other"];

export default function SkillsPage() {
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ txHash: string } | null>(null);

  // Create form state
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillCategory, setSkillCategory] = useState("analysis");
  const [pricePerUse, setPricePerUse] = useState("0.001");
  const [subPrice, setSubPrice] = useState("0.1");
  const [systemPrompt, setSystemPrompt] = useState("");

  const filtered = filter === "all" ? SAMPLE_SKILLS : SAMPLE_SKILLS.filter((s) => s.category === filter);

  const handleCreateSkill = async () => {
    const account = await getCurrentAccount();
    if (!account) return alert("Connect wallet first");
    if (!skillName || !skillDesc) return alert("Fill in name and description");

    setLoading(true);
    setResult(null);
    try {
      const res = await createSkill({
        name: skillName,
        description: skillDesc,
        creator: account,
        weights: btoa(systemPrompt || `Skill: ${skillName}`), // base64 encode
        config: { category: skillCategory, systemPrompt },
        pricePerUse: (parseFloat(pricePerUse) * 1e18).toString(),
        subscriptionPrice: (parseFloat(subPrice) * 1e18).toString(),
      });
      if (res.success) {
        setResult({ txHash: res.txHash });
        // Reset form
        setSkillName("");
        setSkillDesc("");
        setSystemPrompt("");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Skill Marketplace</h1>
            <p className="text-gray-400 text-sm mt-1">Modular AI capabilities as INFTs — equip to any agent</p>
          </div>
          <button
            onClick={() => { setShowCreate(!showCreate); setResult(null); }}
            className="bg-nexus-600 hover:bg-nexus-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showCreate ? "✕ Close" : "+ Create Skill"}
          </button>
        </div>

        {/* ─── Create Skill Form ─────────────────────────── */}
        {showCreate && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Skill</h3>
            <p className="text-xs text-gray-400 mb-4">
              Your skill will be encrypted, uploaded to 0G Storage, and minted as an ERC-7857 INFT on 0G Chain.
            </p>

            {result ? (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm font-medium mb-1">Skill Created!</p>
                <a
                  href={`https://chainscan-galileo.0g.ai/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-nexus-400 hover:text-nexus-300 underline"
                >
                  View on 0G Explorer →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Skill Name *</label>
                    <input
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      placeholder="e.g. Token Analyzer"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Category</label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description *</label>
                  <input
                    type="text"
                    value={skillDesc}
                    onChange={(e) => setSkillDesc(e.target.value)}
                    placeholder="What does this skill do?"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">System Prompt (skill logic)</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={3}
                    placeholder="Define the AI behavior for this skill..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Price Per Use (0G)</label>
                    <input
                      type="text"
                      value={pricePerUse}
                      onChange={(e) => setPricePerUse(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Subscription Price / Month (0G)</label>
                    <input
                      type="text"
                      value={subPrice}
                      onChange={(e) => setSubPrice(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-nexus-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateSkill}
                  disabled={loading}
                  className="w-full bg-nexus-600 hover:bg-nexus-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? "Creating skill on 0G..." : "Create Skill (Mint INFT)"}
                </button>
                <p className="text-[10px] text-gray-500 text-center">
                  Encrypts skill data → uploads to 0G Storage → mints ERC-7857 INFT on 0G Chain
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Filters ───────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          {["all", "analysis", "defi", "development"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === f ? "bg-nexus-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* ─── Skills Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div key={skill.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-nexus-600/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-nexus-950 text-nexus-400 px-2 py-0.5 rounded">{skill.category}</span>
                <span className="text-xs text-gray-500">#{skill.id}</span>
              </div>
              <h3 className="font-semibold mb-1">{skill.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{skill.description}</p>
              <div className="flex items-center justify-between text-xs mb-4">
                <div><span className="text-gray-500">Per use: </span><span className="text-green-400">{skill.pricePerUse}</span></div>
                <div><span className="text-gray-500">Subscribe: </span><span className="text-blue-400">{skill.subscriptionPrice}</span></div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-nexus-600 hover:bg-nexus-700 py-2 rounded-lg text-xs font-medium transition-colors">Pay Per Use</button>
                <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-xs font-medium transition-colors">Subscribe</button>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 text-center">{skill.totalUses} uses · by {skill.creator}</p>
            </div>
          ))}
        </div>

        {/* ─── Info Box ──────────────────────────────────── */}
        <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-2">How Skills Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
            <div>
              <span className="text-nexus-400 font-medium">1. Each skill is an INFT</span>
              <p className="mt-1">Skills are minted as ERC-7857 tokens with encrypted weights stored on 0G Storage.</p>
            </div>
            <div>
              <span className="text-nexus-400 font-medium">2. Equip via AuthorizedUsage</span>
              <p className="mt-1">Pay per use or subscribe. You get execution rights without seeing the source code.</p>
            </div>
            <div>
              <span className="text-nexus-400 font-medium">3. Creators earn royalties</span>
              <p className="mt-1">Every usage payment automatically distributes royalties to the skill creator.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
