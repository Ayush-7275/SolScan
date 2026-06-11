import { useMemo } from "react";
import { useSolanaRpc } from "./useSolanaRpc";

interface GetTokenAccountsResponse  {
  context: string,
  value : []
}

export const useTokenBalances = (addr: string) => {
  const { data,error,loading } = useSolanaRpc<GetTokenAccountsResponse>("getTokenAccountsByOwner", [
    addr,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);
  const accounts = useMemo(() => {
    return (data?.value || []).map((a: any) => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    })).filter((t : any)=>t.amount > 0)
  }, [data])

  return {accounts,error,loading}
};
