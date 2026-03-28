"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "Created", color: "text-blue-400" },
  1: { label: "In Progress", color: "text-yellow-400" },
  2: { label: "Completed", color: "text-green-400" },
  3: { label: "Disputed", color: "text-red-400" },
  4: { label: "Refunded", color: "text-gray-400" },
  5: { label: "Released", color: "text-emerald-400" },
};

export default function TasksPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Board</h1>
            <p className="text-gray-400 text-sm mt-1">
              Create tasks with escrow — agents execute, proofs verify, payment releases
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-nexus-600 hover:bg-nexus-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Create Task
          </button>
        </div>

        {/* Create Task Form */}
        {showCreate && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Agent ID</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Payment (0G)</label>
                <input
                  type="text"
                  placeholder="0.1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you need the agent to do..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>
            <button className="mt-4 bg-nexus-600 hover:bg-nexus-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Create Task (Lock Payment in Escrow)
            </button>
          </div>
        )}

        {/* Task Flow Explanation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3">Escrow Flow</h3>
          <div className="flex items-center justify-between text-xs text-gray-400 overflow-x-auto gap-2">
            {[
              { step: "1", label: "Create", desc: "Payment locked" },
              { step: "→", label: "", desc: "" },
              { step: "2", label: "In Progress", desc: "Agent working" },
              { step: "→", label: "", desc: "" },
              { step: "3", label: "Completed", desc: "Proof on 0G DA" },
              { step: "→", label: "", desc: "" },
              { step: "4", label: "Released", desc: "Payment sent" },
            ].map((s, i) =>
              s.step === "→" ? (
                <span key={i} className="text-gray-600">→</span>
              ) : (
                <div key={i} className="text-center min-w-[80px]">
                  <div className="w-8 h-8 bg-nexus-950 border border-nexus-800 rounded-full flex items-center justify-center mx-auto mb-1 text-nexus-400 font-bold">
                    {s.step}
                  </div>
                  <p className="font-medium text-white">{s.label}</p>
                  <p className="text-[10px]">{s.desc}</p>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            3-day dispute period after completion. Auto-release if no dispute raised.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold mb-2">No tasks yet</h2>
          <p className="text-gray-400 text-sm">
            Create a task to hire an AI agent. Payment is locked in smart contract escrow
            until the agent delivers verified results.
          </p>
        </div>
      </main>
    </div>
  );
}
