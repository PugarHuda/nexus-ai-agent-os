"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { runInference } from "@/lib/api";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";
import NexMascot from "@/components/NexMascot";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  verification?: string;
  safety?: { safetyScore: number; overallSafe: boolean };
  cost?: string;
}

export default function InteractPage() {
  const [agentId, setAgentId] = useState(1);
  const [model, setModel] = useState("deepseek-chat-v3-0324");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await runInference({ agentId, model, messages: apiMessages });

      const assistantMsg: Message = {
        role: "assistant",
        content: res.output,
        verification: res.verification,
        safety: res.safety,
        cost: res.cost,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-6">
        {/* Config Bar */}
        <PixelCard borderColor="border-gray-600" className="flex items-center gap-4 mb-4 p-3">
          <div className="flex items-center gap-2">
            <label className="font-pixel text-[7px] text-gray-400 uppercase">AGENT:</label>
            <input
              type="number"
              value={agentId}
              onChange={(e) => setAgentId(parseInt(e.target.value) || 1)}
              className="w-16 bg-gray-800 border-2 border-gray-600 font-mono px-2 py-1 text-xs text-center"
              min={1}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-pixel text-[7px] text-gray-400 uppercase">MODEL:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-gray-800 border-2 border-gray-600 font-mono px-2 py-1 text-xs"
            >
              <option value="deepseek-chat-v3-0324">DeepSeek V3</option>
              <option value="gpt-oss-120b">GPT-OSS 120B</option>
              <option value="qwen3-vl-30b-a3b-instruct">Qwen3 VL 30B</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-1.5 font-pixel text-[7px] text-gray-500">
            <div className="w-2 h-2 bg-green-500" />
            TEEML VERIFIED
          </div>
        </PixelCard>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <NexMascot variant="wave" size={64} />
              <h2 className="font-pixel text-[12px] uppercase mb-2">CHAT WITH AGENT #{agentId}</h2>
              <p className="font-pixel text-[7px] text-gray-400 leading-relaxed">
                ALL RESPONSES ARE GENERATED VIA 0G COMPUTE WITH TEEML VERIFICATION.
                <br />
                REPUTATION UPDATES AUTOMATICALLY AFTER EACH INTERACTION.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 border-2 ${
                  msg.role === "user"
                    ? "bg-indigo-900/60 border-indigo-500 text-white"
                    : msg.role === "system"
                    ? "bg-red-900/30 border-red-500 text-red-300"
                    : "bg-gray-900 border-gray-600"
                }`}
              >
                <p className="text-sm font-mono whitespace-pre-wrap">{msg.content}</p>

                {/* Verification badge */}
                {msg.verification && (
                  <div className="mt-2 pt-2 border-t border-gray-700 flex items-center gap-3 font-pixel text-[6px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">✓</span> TEEML: {msg.verification.slice(0, 20)}...
                    </span>
                    {msg.safety && (
                      <span className={msg.safety.overallSafe ? "text-green-400" : "text-red-400"}>
                        SAFETY: {msg.safety.safetyScore}%
                      </span>
                    )}
                    {msg.cost && <span>COST: {msg.cost} 0G</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-900 border-2 border-gray-600 px-4 py-3">
                <div className="flex items-center gap-2 font-pixel text-[8px] text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-500 animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  </div>
                  RUNNING ON 0G COMPUTE...
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder=">> MESSAGE AGENT..."
            className="flex-1 bg-gray-800 border-2 border-gray-600 font-mono px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
            disabled={loading}
          />
          <PixelButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3"
          >
            SEND
          </PixelButton>
        </div>
      </main>
    </div>
  );
}
