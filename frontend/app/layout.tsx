import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus — Decentralized AI Agent OS",
  description:
    "The operating system for AI agents on 0G. Create, compose, and monetize AI agents with on-chain reputation and verifiable inference.",
  keywords: ["AI", "agents", "0G", "blockchain", "INFT", "ERC-7857", "decentralized"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
