"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { createTask, listTasks } from "@/lib/api";
import { getCurrentAccount } from "@/lib/wallet";
import { ethers } from "ethers";
import PixelCard from "@/components/PixelCard";
import PixelButton from "@/components/PixelButton";

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "CREATED", color: "text-blue-400" },
  1: { label: "IN PROGRESS", color: "text-yellow-400" },
  2: { label: "COMPLETED", color: "text-green-400" },
  3: { label: "DISPUTED", color: "text-red-400" },
  4: { label: "REFUNDED", color: "text-gray-400" },
  5: { label: "RELEASED", color: "text-emerald-400" },
};

interface TaskItem {
  id: number;
  requester: string;
  agentId: number;
  payment: string;
  description: string;
  status: number;
  createdAt: string;
}

export default function TasksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [taskAgentId, setTaskAgentId] = useState("1");
  const [taskPayment, setTaskPayment] = useState("0.1");
  const [taskDesc, setTaskDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setFetching(true);
    try {
      const res = await listTasks();
      setTasks(res.tasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setFetching(false);
    }
  }

  const handleCreateTask = async () => {
    const account = await getCurrentAccount();
    if (!account) return alert("Connect wallet first");
    if (!taskDesc) return alert("Add a description");

    setLoading(true);
    try {
      const paymentWei = ethers.parseEther(taskPayment).toString();
      const res = await createTask({
        agentId: parseInt(taskAgentId),
        agentOwner: account,
        description: taskDesc,
        payment: paymentWei,
      });
      if (res.success) {
        setTaskDesc("");
        setShowCreate(false);
        await loadTasks();
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
            <h1 className="font-pixel text-[16px] uppercase tracking-wider">TASK BOARD</h1>
            <p className="text-gray-400 font-pixel text-[7px] mt-2">
              CREATE TASKS WITH ESCROW — DATA FROM ON-CHAIN
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PixelButton onClick={loadTasks} variant="secondary">↻ REFRESH</PixelButton>
            <PixelButton onClick={() => setShowCreate(!showCreate)}>+ CREATE TASK</PixelButton>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreate && (
          <PixelCard borderColor="border-indigo-500/50" className="mb-6 pixel-shadow">
            <h3 className="font-pixel text-[10px] uppercase mb-4 text-indigo-400">NEW TASK</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-pixel text-[7px] text-gray-400 mb-1 uppercase">AGENT ID</label>
                <input type="number" value={taskAgentId} onChange={(e) => setTaskAgentId(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 font-mono px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block font-pixel text-[7px] text-gray-400 mb-1 uppercase">PAYMENT (0G)</label>
                <input type="text" value={taskPayment} onChange={(e) => setTaskPayment(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 font-mono px-3 py-2 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-pixel text-[7px] text-gray-400 mb-1 uppercase">DESCRIPTION</label>
                <textarea rows={3} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder=">> Describe what you need the agent to do..." className="w-full bg-gray-800 border-2 border-gray-600 font-mono px-3 py-2 text-sm resize-none" />
              </div>
            </div>
            <PixelButton onClick={handleCreateTask} disabled={loading} className="mt-4">
              {loading ? "CREATING ON-CHAIN..." : "CREATE TASK (LOCK PAYMENT IN ESCROW)"}
            </PixelButton>
          </PixelCard>
        )}

        {/* Task Flow Explanation */}
        <PixelCard borderColor="border-indigo-500/30" className="mb-6">
          <h3 className="font-pixel text-[10px] uppercase mb-4 text-indigo-400">ESCROW FLOW</h3>
          <div className="flex items-center justify-between text-xs text-gray-400 overflow-x-auto gap-2">
            {[
              { step: "1", label: "CREATE", desc: "Payment locked" },
              { step: "→", label: "", desc: "" },
              { step: "2", label: "IN PROGRESS", desc: "Agent working" },
              { step: "→", label: "", desc: "" },
              { step: "3", label: "COMPLETED", desc: "Proof on 0G DA" },
              { step: "→", label: "", desc: "" },
              { step: "4", label: "RELEASED", desc: "Payment sent" },
            ].map((s, i) =>
              s.step === "→" ? (
                <span key={i} className="text-gray-600 font-pixel text-[10px]">►</span>
              ) : (
                <div key={i} className="text-center min-w-[80px]">
                  <div className="w-8 h-8 bg-gray-800 border-2 border-indigo-500/50 flex items-center justify-center mx-auto mb-1 text-indigo-400 font-pixel text-[10px]">{s.step}</div>
                  <p className="font-pixel text-[7px] text-white">{s.label}</p>
                  <p className="font-pixel text-[6px] text-gray-500">{s.desc}</p>
                </div>
              )
            )}
          </div>
          <p className="font-pixel text-[6px] text-gray-500 mt-4 text-center">
            3-DAY DISPUTE PERIOD AFTER COMPLETION. AUTO-RELEASE IF NO DISPUTE RAISED.
          </p>
        </PixelCard>

        {/* Task List */}
        {fetching ? (
          <PixelCard borderColor="border-gray-700" className="p-12 text-center">
            <div className="text-2xl mb-3 animate-pulse">⛓️</div>
            <p className="font-pixel text-[8px] text-gray-400">READING TASKS FROM 0G CHAIN...</p>
          </PixelCard>
        ) : tasks.length === 0 ? (
          <PixelCard borderColor="border-gray-700" className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="font-pixel text-[12px] uppercase mb-2">NO TASKS YET</h2>
            <p className="text-gray-400 font-pixel text-[7px] leading-relaxed">
              CREATE A TASK TO HIRE AN AI AGENT. PAYMENT IS LOCKED IN SMART CONTRACT ESCROW UNTIL THE AGENT DELIVERS VERIFIED RESULTS.
            </p>
          </PixelCard>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <PixelCard key={task.id} borderColor="border-gray-700" hover className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-[7px] bg-gray-800 border border-gray-600 px-2 py-0.5 text-gray-400">#{task.id}</span>
                    <span className={`font-pixel text-[7px] ${STATUS_LABELS[task.status]?.color || "text-gray-400"}`}>
                      {STATUS_LABELS[task.status]?.label || "UNKNOWN"}
                    </span>
                  </div>
                  <p className="text-sm font-mono">{task.description}</p>
                  <p className="font-pixel text-[7px] text-gray-500 mt-1">AGENT #{task.agentId} · {ethers.formatEther(task.payment)} 0G</p>
                </div>
                <span className="font-mono text-[10px] text-gray-600">{task.requester.slice(0, 8)}...</span>
              </PixelCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
