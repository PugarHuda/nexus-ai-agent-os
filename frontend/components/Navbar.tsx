"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, getCurrentAccount, getChainId, isOGNetwork } from "@/lib/wallet";
import { IS_TESTNET } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/interact", label: "Interact" },
  { href: "/tasks", label: "Tasks" },
  { href: "/leaderboard", label: "Leaderboard" },
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
    <header className="border-b border-gray-800 px-6 py-3 sticky top-0 bg-gray-950/90 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-nexus-500 to-purple-600 rounded-lg" />
            <span className="text-lg font-bold">Nexus</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className={`w-1.5 h-1.5 rounded-full ${onOG ? "bg-green-500" : "bg-yellow-500"}`} />
            {onOG ? (IS_TESTNET ? "0G Testnet" : "0G Mainnet") : "Wrong Network"}
          </div>

          {account ? (
            <div className="bg-gray-800 px-3 py-1.5 rounded-lg text-sm text-gray-300 font-mono">
              {shortAddr}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-nexus-600 hover:bg-nexus-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
