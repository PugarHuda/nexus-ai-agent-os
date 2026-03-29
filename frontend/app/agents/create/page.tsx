"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { mintAgent } from "@/lib/api";
import { getCurrentAccount } from "@/lib/wallet";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";

const MODELS = [
  { id: "deepseek-chat-v3-0324", name: "DeepSeek V3", type: "Chatbot", cost: "0.30/1.00 0G" },
  { id: "gpt-oss-120b", name: "GPT-OSS 120B", type: "Chatbot", cost: "0.10/0.49 0G" },
  { id: "qwen3-vl-30b-a3b-instruct", name: "Qwen3 VL 30B", type: "Vision-Language", cost: "0.49/0.49 0G" },
];

const CAPABILITY_OPTIONS = [
  "market-analysis", "trend-identification", "risk-assessment",
  "code-review", "code-generation", "smart-contract-audit",
  "task-decomposition", "multi-agent-coordination", "data-summarization",
  "sentiment-analysis", "report-generation",
];

export default function CreateAgentPage() {
  const [name, setName] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tokenId: string; txHash: string } | null>(null);

  const toggleCapability = (cap: string) => {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleCreate = async () => {
    const account = await getCurrentAccount();
    if (!account) return alert("Connect wallet first");
    if (!name || !systemPrompt) return alert("Fill in all fields");

    setLoading(true);
    try {
      const res = await mintAgent({
        owner: account,
        model,
        config: { name, systemPrompt, temperature: 0.7 },
        capabilities,
      });
      if (res.success) {
        setResult({ tokenId: res.tokenId, txHash: res.txHash });
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

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-pixel text-[16px] uppercase tracking-wider mb-1">CREATE AGENT</h1>
        <p className="text-gray-400 font-pixel text-[7px] mb-8">
          BIRTH A NEW AI AGENT. ITS BRAIN WILL BE ENCRYPTED ON 0G STORAGE AND MINTED AS AN INFT ON 0G CHAIN.
        </p>

        {result ? (
          <PixelCard borderColor="border-green-500" className="p-6 text-center pixel-shadow">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="font-pixel text-[12px] uppercase mb-2 text-green-400">AGENT CREATED!</h2>
            <p className="font-pixel text-[8px] text-gray-300 mb-4">
              TOKEN ID: <span className="font-mono text-green-400">#{result.tokenId}</span>
            </p>
            <a
              href={`https://chainscan.0g.ai/tx/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[8px] text-indigo-400 hover:text-indigo-300 underline"
            >
              VIEW ON 0G EXPLORER →
            </a>
          </PixelCard>
        ) : (
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-pixel text-[8px] uppercase mb-2">AGENT NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=">> e.g. Market Analyst Pro"
                className="w-full bg-gray-800 border-2 border-gray-600 font-mono px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block font-pixel text-[8px] uppercase mb-2">AI MODEL (0G COMPUTE)</label>
              <div className="space-y-2">
                {MODELS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-colors ${
                      model === m.id
                        ? "border-indigo-500 bg-indigo-950/30"
                        : "border-gray-600 bg-gray-900 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="model"
                        value={m.id}
                        checked={model === m.id}
                        onChange={() => setModel(m.id)}
                        className="accent-indigo-500"
                      />
                      <div>
                        <p className="font-pixel text-[8px]">{m.name.toUpperCase()}</p>
                        <p className="font-pixel text-[6px] text-gray-500">{m.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="font-pixel text-[7px] text-gray-400">{m.cost}</span>
                  </label>
                ))}
              </div>
              <p className="font-pixel text-[6px] text-gray-500 mt-2">ALL MODELS RUN WITH TEEML VERIFICATION ON 0G COMPUTE</p>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block font-pixel text-[8px] uppercase mb-2">SYSTEM PROMPT</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                placeholder=">> Define your agent's personality, expertise, and behavior..."
                className="w-full bg-gray-800 border-2 border-gray-600 font-mono px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            {/* Capabilities */}
            <div>
              <label className="block font-pixel text-[8px] uppercase mb-2">CAPABILITIES</label>
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_OPTIONS.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => toggleCapability(cap)}
                    className={`px-3 py-1 border-2 font-pixel text-[7px] transition-colors ${
                      capabilities.includes(cap)
                        ? "bg-indigo-600 text-white border-indigo-400"
                        : "bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                    }`}
                  >
                    {cap.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <PixelButton
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3"
            >
              {loading ? "CREATING AGENT ON 0G..." : "CREATE AGENT (MINT INFT)"}
            </PixelButton>

            <p className="font-pixel text-[6px] text-gray-500 text-center">
              THIS WILL ENCRYPT YOUR AGENT CONFIG, UPLOAD TO 0G STORAGE, AND MINT AN ERC-7857 INFT ON 0G CHAIN.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
