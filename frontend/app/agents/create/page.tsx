"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { mintAgent } from "@/lib/api";
import { getCurrentAccount } from "@/lib/wallet";

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
        <h1 className="text-2xl font-bold mb-1">Create Agent</h1>
        <p className="text-gray-400 text-sm mb-8">
          Birth a new AI agent. Its brain will be encrypted on 0G Storage and minted as an INFT on 0G Chain.
        </p>

        {result ? (
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-lg font-semibold mb-2">Agent Created!</h2>
            <p className="text-sm text-gray-300 mb-4">
              Token ID: <span className="font-mono text-green-400">#{result.tokenId}</span>
            </p>
            <a
              href={`https://chainscan.0g.ai/tx/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-nexus-400 hover:text-nexus-300 underline"
            >
              View on 0G Explorer →
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Market Analyst Pro"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-nexus-500 focus:outline-none"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium mb-2">AI Model (0G Compute)</label>
              <div className="space-y-2">
                {MODELS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      model === m.id
                        ? "border-nexus-500 bg-nexus-950/30"
                        : "border-gray-700 bg-gray-900 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="model"
                        value={m.id}
                        checked={model === m.id}
                        onChange={() => setModel(m.id)}
                        className="accent-nexus-500"
                      />
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{m.cost}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">All models run with TeeML verification on 0G Compute</p>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                placeholder="Define your agent's personality, expertise, and behavior..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-nexus-500 focus:outline-none resize-none"
              />
            </div>

            {/* Capabilities */}
            <div>
              <label className="block text-sm font-medium mb-2">Capabilities</label>
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_OPTIONS.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => toggleCapability(cap)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      capabilities.includes(cap)
                        ? "bg-nexus-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-nexus-600 hover:bg-nexus-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? "Creating agent on 0G..." : "Create Agent (Mint INFT)"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              This will encrypt your agent config, upload to 0G Storage, and mint an ERC-7857 INFT on 0G Chain.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
