import { useMemo, useState } from "react";
import { useSolanaRpc } from "./useSolanaRpc";

interface GetBalanceResponse {
  context: { slot: number };
  value: number; // This is the balance in Lamports
}

export const useWalletBalance = (address: string) => {
  const { data, loading, error } = useSolanaRpc<GetBalanceResponse>(
    "getBalance",
    [address],
  );

  const balance = useMemo(() => {
    if (!data) return 0;

    return data.value / 1_000_000_000;
  }, [data]);

  return { balance, data, loading, error };
};
