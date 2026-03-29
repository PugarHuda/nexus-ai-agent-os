"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";
import { createSkill, listSkills } from "@/lib/api";
import NexMascot from "@/components/NexMascot";
import { getCurrentAccount } from "@/lib/wallet";
import { ethers } from "ethers";

interface SkillItem {
  id: number;
  name: string;
  description: string;
  pricePerUse: string;
  subscriptionPrice: string;
  totalUses: string;
  creator: string;
  active: boolean;
}

const CATEGORIES = ["analysis", "defi", "development", "orchestration", "other"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ txHash: string } | null>(null);

  // Create form state
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillCategory, setSkillCategory] = useState("analysis");
  const [pricePerUse, setPricePerUse] = useState("0.001");
  const [subPrice, setSubPrice] = useState("0.1");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    try {
      const res = await listSkills();
      setSkills(res.skills);
    } catch (err) {
      console.error("Failed to load skills from chain:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSkill = async () => {
    const account = await getCurrentAccount();
    if (!account) return alert("Connect wallet first");
    if (!skillName || !skillDesc) return alert("Fill in name and description");

    setCreating(true);
    setResult(null);
    try {
      const res = await createSkill({
        name: skillName,
        description: skillDesc,
        creator: account,
        weights: btoa(systemPrompt || `Skill: ${skillName}`),
        config: { category: skillCategory, systemPrompt },
        pricePerUse: (parseFloat(pricePerUse) * 1e18).toString(),
        subscriptionPrice: (parseFloat(subPrice) * 1e18).toString(),
      });
      if (res.success) {
        setResult({ txHash: res.txHash });
        setSkillName("");
        setSkillDesc("");
        setSystemPrompt("");
        // Reload skills from chain
        await loadSkills();
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  function formatOG(wei: string): string {
    try {
      return `${ethers.formatEther(wei)} 0G`;
    } catch {
      return `${wei} wei`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-pixel text-[16px] text-indigo-400">SKILL MARKETPLACE</h1>
            <p className="font-pixel text-[6px] text-gray-400 mt-2">MODULAR AI CAPABILITIES AS INFTS — DATA FROM ON-CHAIN</p>
          </div>
          <div className="flex items-center gap-3">
            <PixelButton onClick={loadSkills} variant="secondary">↻ REFRESH</PixelButton>
            <PixelButton
              onClick={() => { setShowCreate(!showCreate); setResult(null); }}
              variant="primary"
            >
              {showCreate ? "✕ CLOSE" : "+ CREATE SKILL"}
            </PixelButton>
          </div>
        </div>

        {/* ─── Create Skill Form ─────────────────────────── */}
        {showCreate && (
          <PixelCard borderColor="border-indigo-500" className="mb-6 p-6 pixel-shadow">
            <h3 className="font-pixel text-[10px] text-indigo-400 mb-4">CREATE NEW SKILL</h3>
            <p className="font-pixel text-[6px] text-gray-400 mb-4">
              YOUR SKILL WILL BE ENCRYPTED, UPLOADED TO 0G STORAGE, AND MINTED AS AN ERC-7857 INFT ON 0G CHAIN.
            </p>

            {result ? (
              <div className="bg-green-900/20 border-2 border-green-500 p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-pixel text-[8px] text-green-400 mb-1">SKILL CREATED ON-CHAIN!</p>
                <a
                  href={`https://chainscan-galileo.0g.ai/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-pixel text-[6px] text-indigo-400 hover:text-indigo-300 underline"
                >
                  VIEW ON 0G EXPLORER →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">SKILL NAME *</label>
                    <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="e.g. Token Analyzer" className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">CATEGORY</label>
                    <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono">
                      {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">DESCRIPTION *</label>
                  <input type="text" value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} placeholder="What does this skill do?" className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">SYSTEM PROMPT (SKILL LOGIC)</label>
                  <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={3} placeholder="Define the AI behavior for this skill..." className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">PRICE PER USE (0G)</label>
                    <input type="text" value={pricePerUse} onChange={(e) => setPricePerUse(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block font-pixel text-[6px] text-gray-400 mb-1 uppercase">SUBSCRIPTION / MONTH (0G)</label>
                    <input type="text" value={subPrice} onChange={(e) => setSubPrice(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono" />
                  </div>
                </div>
                <PixelButton onClick={handleCreateSkill} disabled={creating} className="w-full">
                  {creating ? "CREATING ON 0G CHAIN..." : "CREATE SKILL (MINT INFT)"}
                </PixelButton>
              </div>
            )}
          </PixelCard>
        )}

        {/* ─── Skills Grid ───────────────────────────────── */}
        {loading ? (
          <PixelCard borderColor="border-indigo-500" className="p-12 text-center pixel-shadow">
            <NexMascot variant="think" size={48} animate />
            <p className="font-pixel text-[8px] text-gray-400">READING SKILLS FROM 0G CHAIN...</p>
          </PixelCard>
        ) : skills.length === 0 ? (
          <PixelCard borderColor="border-indigo-500" className="p-12 text-center pixel-shadow">
            <NexMascot variant="wave" size={64} />
            <h2 className="font-pixel text-[12px] text-white mb-2">NO SKILLS YET</h2>
            <p className="font-pixel text-[6px] text-gray-400">CREATE THE FIRST SKILL TO POPULATE THE MARKETPLACE.</p>
          </PixelCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.filter((s) => s.active).map((skill) => (
              <PixelCard key={skill.id} borderColor="border-gray-700" hover className="pixel-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[6px] bg-indigo-950 text-indigo-400 border-2 border-indigo-500/30 px-2 py-1">INFT #{skill.id}</span>
                </div>
                <h3 className="font-pixel text-[10px] text-white mb-1">{skill.name.toUpperCase()}</h3>
                <p className="font-pixel text-[6px] text-gray-400 mb-4">{skill.description}</p>
                <div className="flex items-center justify-between font-pixel text-[6px] mb-4">
                  <div><span className="text-gray-500">PER USE: </span><span className="text-green-400">{formatOG(skill.pricePerUse)}</span></div>
                  <div><span className="text-gray-500">SUBSCRIBE: </span><span className="text-indigo-400">{formatOG(skill.subscriptionPrice)}</span></div>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="primary" className="flex-1">PAY PER USE</PixelButton>
                  <PixelButton variant="secondary" className="flex-1">SUBSCRIBE</PixelButton>
                </div>
                <p className="font-pixel text-[6px] text-gray-600 mt-2 text-center">{skill.totalUses} USES · BY {skill.creator.slice(0, 8)}...</p>
              </PixelCard>
            ))}
          </div>
        )}

        {/* ─── Info Box ──────────────────────────────────── */}
        <div className="mt-8">
          <PixelCard borderColor="border-yellow-500" className="pixel-shadow">
            <h3 className="font-pixel text-[10px] text-yellow-400 mb-3">HOW SKILLS WORK</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-pixel text-[6px] text-indigo-400">1. EACH SKILL IS AN INFT</span>
                <p className="font-pixel text-[6px] text-gray-400 mt-1">Skills are minted as ERC-7857 tokens with encrypted weights stored on 0G Storage.</p>
              </div>
              <div>
                <span className="font-pixel text-[6px] text-indigo-400">2. EQUIP VIA AUTHORIZEDUSAGE</span>
                <p className="font-pixel text-[6px] text-gray-400 mt-1">Pay per use or subscribe. You get execution rights without seeing the source code.</p>
              </div>
              <div>
                <span className="font-pixel text-[6px] text-indigo-400">3. CREATORS EARN ROYALTIES</span>
                <p className="font-pixel text-[6px] text-gray-400 mt-1">Every usage payment automatically distributes royalties to the skill creator.</p>
              </div>
            </div>
          </PixelCard>
        </div>
      </main>
    </div>
  );
}
