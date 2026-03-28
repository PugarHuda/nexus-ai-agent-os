import { OG_NETWORK, OG_CHAIN_ID } from "./constants";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) {
    alert("Please install MetaMask to use Nexus");
    return null;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    // Switch to 0G network
    await switchToOGNetwork();

    return accounts[0] || null;
  } catch (err) {
    console.error("Wallet connection failed:", err);
    return null;
  }
}

export async function switchToOGNetwork(): Promise<void> {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: OG_NETWORK.chainId }],
    });
  } catch (switchError: any) {
    // Chain not added yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [OG_NETWORK],
      });
    }
  }
}

export async function getCurrentAccount(): Promise<string | null> {
  if (!window.ethereum) return null;
  const accounts = (await window.ethereum.request({
    method: "eth_accounts",
  })) as string[];
  return accounts[0] || null;
}

export async function getChainId(): Promise<number | null> {
  if (!window.ethereum) return null;
  const chainId = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;
  return parseInt(chainId, 16);
}

export function isOGNetwork(chainId: number): boolean {
  return chainId === OG_CHAIN_ID;
}
