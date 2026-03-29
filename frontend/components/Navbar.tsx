"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, getCurrentAccount, getChainId, isOGNetwork } from "@/lib/wallet";
import { IS_TESTNET } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard", label: "DASH" },
  { href: "/agents", label: "AGENTS" },
  { href: "/skills", label: "SKILLS" },
  { href: "/interact", label: "CHAT" },
  { href: "/tasks", label: "TASKS" },
  { href: "/leaderboard", label: "RANK" },
];

export default function Navbar() {
  const [account, setAccount] = useState<string | null>(null);
  const [onOG, setOnOG] = useState(false);

  useEffect(() => {
    (async () => {
      const acc = await getCurrentAccount();
      setAccount(acc);
      const chain = await getChainId();
      if (chain) setOnOG(isOGNetwork(chain));
    })();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: unknown) => {
        const accs = accounts as string[];
        setAccount(accs[0] || null);
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  const handleConnect = async () => {
    const acc = await connectWallet();
    setAccount(acc);
    const chain = await getChainId();
    if (chain) setOnOG(isOGNetwork(chain));
  };

  const shortAddr = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null;

  return (
    <header className="border-b-4 border-indigo-600 px-6 py-2.5 sticky top-0 bg-gray-950/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-500" />
            <span className="font-pixel text-[9px]">NEXUS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-1.5 font-pixel text-[7px] text-gray-500 hover:text-indigo-400 hover:bg-gray-800/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-pixel text-[6px] text-gray-600">
            <div className={`w-2 h-2 ${onOG ? "bg-green-500" : "bg-yellow-500"}`} />
            {onOG ? (IS_TESTNET ? "0G TEST" : "0G MAIN") : "WRONG NET"}
          </div>

          {account ? (
            <div className="bg-gray-800 border-2 border-gray-700 px-3 py-1.5 font-pixel text-[7px] text-indigo-400 font-mono">
              {shortAddr}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 px-3 py-1.5 font-pixel text-[7px] transition-colors"
            >
              CONNECT
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
