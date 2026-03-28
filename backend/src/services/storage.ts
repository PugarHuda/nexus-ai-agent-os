/**
 * 0G Storage Service — REAL IMPLEMENTATION
 *
 * Uses @0gfoundation/0g-ts-sdk for actual 0G Storage interaction.
 * Storage Indexer: https://indexer-storage-turbo.0g.ai
 *
 * Two layers:
 * - Log Layer (append-only): immutable agent history
 * - KV Layer (mutable): working memory, agent state
 */

import { ethers } from "ethers";
import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { ZgFile, Indexer } from "@0gfoundation/0g-ts-sdk";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const STORAGE_INDEXER = process.env.OG_STORAGE_INDEXER || "https://indexer-storage-turbo.0g.ai";
const RPC_URL = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";

export interface StorageResult {
  rootHash: string;
  encryptedURI: string;
  metadataHash: string;
  txHash?: string;
}

export interface AgentMetadata {
  model: string;
  weights?: string;
  config: Record<string, unknown>;
  capabilities: string[];
  version: string;
}

// ─── Encryption ──────────────────────────────────────────

export function encryptData(data: string, key: Buffer): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();
  return { encrypted, iv: iv.toString("hex"), tag: tag.toString("hex") };
}

export function decryptData(encrypted: string, key: Buffer, iv: string, tag: string): string {
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function computeMetadataHash(metadata: AgentMetadata): string {
  return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
}

// ─── 0G SDK Helpers ──────────────────────────────────────

function getSigner() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
}

function getIndexer(): Indexer {
  return new Indexer(STORAGE_INDEXER);
}

/**
 * Write data to a temp file, upload via 0G SDK, return root hash
 */
async function uploadToOGStorage(data: string): Promise<{ rootHash: string; txHash: string }> {
  const signer = getSigner();
  const indexer = getIndexer();

  // Write to temp file (SDK requires file path)
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `nexus_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(tmpFile, data, "utf-8");

  try {
    const file = await ZgFile.fromFilePath(tmpFile);
    const [txHash, rootHash] = await indexer.upload(file, RPC_URL, signer);
    await file.close();

    console.log(`[Storage] Uploaded to 0G: rootHash=${rootHash}, tx=${txHash}`);
    return { rootHash, txHash };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

/**
 * Download data from 0G Storage by root hash
 */
async function downloadFromOGStorage(rootHash: string): Promise<string> {
  const indexer = getIndexer();

  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `nexus_dl_${Date.now()}.json`);

  try {
    await indexer.download(rootHash, tmpFile, true);
    const data = fs.readFileSync(tmpFile, "utf-8");
    return data;
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

// ─── Public API ──────────────────────────────────────────

/**
 * Upload encrypted agent metadata to 0G Storage
 */
export async function uploadAgentMetadata(
  metadata: AgentMetadata,
  ownerAddress: string
): Promise<StorageResult> {
  const serialized = JSON.stringify(metadata);
  const encryptionKey = randomBytes(32);
  const { encrypted, iv, tag } = encryptData(serialized, encryptionKey);

  const storagePayload = JSON.stringify({
    encrypted, iv, tag,
    owner: ownerAddress,
    type: "agent_metadata",
    createdAt: Date.now(),
  });

  const metadataHash = computeMetadataHash(metadata);

  try {
    const { rootHash, txHash } = await uploadToOGStorage(storagePayload);
    return {
      rootHash,
      encryptedURI: `0g://${rootHash}`,
      metadataHash,
      txHash,
    };
  } catch (err: any) {
    console.warn(`[Storage] 0G upload failed, using hash fallback: ${err.message}`);
    // Fallback for development/testing when 0G Storage is unreachable
    const contentHash = createHash("sha256").update(storagePayload).digest("hex");
    return {
      rootHash: `0x${contentHash}`,
      encryptedURI: `0g://fallback/${contentHash.slice(0, 16)}`,
      metadataHash,
    };
  }
}

/**
 * Upload skill data to 0G Storage
 */
export async function uploadSkillData(
  skillData: { name: string; weights: string; config: Record<string, unknown> },
  creatorAddress: string
): Promise<StorageResult> {
  const metadata: AgentMetadata = {
    model: skillData.name,
    weights: skillData.weights,
    config: skillData.config,
    capabilities: [skillData.name],
    version: "1.0",
  };
  return uploadAgentMetadata(metadata, creatorAddress);
}

/**
 * Store agent memory entry (Log Layer — immutable)
 */
export async function storeMemoryLog(
  agentId: number,
  entry: { action: string; input: string; output: string; timestamp: number }
): Promise<string> {
  const payload = JSON.stringify({
    agentId,
    ...entry,
    type: "memory_log",
  });

  try {
    const { rootHash } = await uploadToOGStorage(payload);
    return `0g://log/${rootHash}`;
  } catch (err: any) {
    console.warn(`[Storage] Memory log fallback: ${err.message}`);
    const hash = createHash("sha256").update(payload).digest("hex");
    return `0g://log/${hash.slice(0, 16)}`;
  }
}

/**
 * Store/update agent working state (KV Layer — mutable)
 * Note: 0G KV Layer requires a separate KV node. For hackathon,
 * we use Log Layer with key-based naming convention.
 */
export async function updateWorkingMemory(
  agentId: number,
  key: string,
  value: unknown
): Promise<void> {
  const payload = JSON.stringify({
    agentId, key, value,
    type: "kv_state",
    updatedAt: Date.now(),
  });

  try {
    await uploadToOGStorage(payload);
    console.log(`[KV] Updated memory for agent ${agentId}: ${key}`);
  } catch (err: any) {
    console.warn(`[KV] Memory update fallback: ${err.message}`);
  }
}

/**
 * Retrieve agent metadata from 0G Storage
 */
export async function retrieveMetadata(rootHash: string): Promise<string | null> {
  try {
    return await downloadFromOGStorage(rootHash);
  } catch (err: any) {
    console.warn(`[Storage] Download failed: ${err.message}`);
    return null;
  }
}
