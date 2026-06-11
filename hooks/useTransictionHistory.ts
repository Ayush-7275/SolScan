import { useMemo } from "react";
import { useSolanaRpc } from "./useSolanaRpc";

// We define what ONE transaction looks like in the raw Solana array
interface SignatureItem {
  signature: string;
  blockTime: number | null;
  confirmationStatus: string;
  err: any;
}

export const useTransactionHistory = (address: string) => {
  // We tell the RPC hook to expect an array of SignatureItems
  const { data, error, loading } = useSolanaRpc<SignatureItem[]>(
    "getSignaturesForAddress", 
    [
      address,
      {
        commitment: "finalized",
        limit: 10,
      },
    ]
  );

  const history = useMemo(() => {
    if (!data) return [];
    
    return data.map((a) => (
      {
        sig: a.signature,
        time: a.blockTime,
        status: a.confirmationStatus
      }
    ));
  }, [data]);

  return { history, error, loading };
};