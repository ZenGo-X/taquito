import { TzProvider } from "./interface";
import { RpcClient } from "tezos-rpc";

export class RpcTzProvider implements TzProvider {
  constructor(private rpc: RpcClient) {}

  async getBalance(address: string): Promise<number> {
    const result = await this.rpc.getBalance(address);
    return Number(result);
  }

  async getDelegate(address: string): Promise<string | null> {
    return this.rpc.getDelegate(address);
  }
}
