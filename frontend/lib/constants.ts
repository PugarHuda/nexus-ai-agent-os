// Reads from env — defaults to TESTNET
export const OG_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "16602");
export const OG_RPC = process.env.NEXT_PUBLIC_OG_RPC || "https://evmrpc-testnet.0g.ai";
export const OG_EXPLORER = process.env.NEXT_PUBLIC_OG_EXPLORER || "https://chainscan-galileo.0g.ai";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const IS_TESTNET = OG_CHAIN_ID === 16602;

export const CONTRACTS = {
  agentINFT: process.env.NEXT_PUBLIC_AGENT_CONTRACT || "",
  skillRegistry: process.env.NEXT_PUBLIC_SKILL_CONTRACT || "",
  reputation: process.env.NEXT_PUBLIC_REPUTATION_CONTRACT || "",
  escrow: process.env.NEXT_PUBLIC_ESCROW_CONTRACT || "",
};

export const OG_NETWORK = {
  chainId: `0x${OG_CHAIN_ID.toString(16)}`,
  chainName: IS_TESTNET ? "0G Galileo Testnet" : "0G Mainnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: [OG_RPC],
  blockExplorerUrls: [OG_EXPLORER],
};

export const REPUTATION_DIMENSIONS = [
  { key: "accuracy", label: "Accuracy", weight: 30, color: "#6366f1" },
  { key: "reliability", label: "Reliability", weight: 25, color: "#22c55e" },
  { key: "safety", label: "Safety", weight: 30, color: "#f59e0b" },
  { key: "collaboration", label: "Collaboration", weight: 15, color: "#ec4899" },
] as const;
