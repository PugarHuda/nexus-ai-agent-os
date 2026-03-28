declare module "@0gfoundation/0g-ts-sdk" {
  import { Signer } from "ethers";

  export class ZgFile {
    static fromFilePath(path: string): Promise<ZgFile>;
    close(): Promise<void>;
  }

  export class Indexer {
    constructor(indexerUrl: string);
    upload(file: ZgFile, rpcUrl: string, signer: Signer): Promise<[string, string]>;
    download(rootHash: string, outputPath: string, withProof: boolean): Promise<void>;
  }

  export function getFlowContract(address: string, signer: Signer): any;
  export function getMarketContract(address: string, signer: Signer): any;
}

declare module "@0glabs/0g-serving-broker" {
  import { Signer } from "ethers";

  export function createBroker(signer: Signer): Promise<{
    inference: {
      listService(): Promise<Array<{ provider: string; name: string; model: string }>>;
      getRequestHeaders(provider: string, name: string): Promise<{ endpoint: string; headers: Record<string, string> }>;
      processResponse(provider: string, name: string, response: any): Promise<void>;
    };
    ledger: {
      depositFund(amount: number): Promise<void>;
      transferFund(provider: string, type: string, amount: bigint): Promise<void>;
    };
  }>;
}
