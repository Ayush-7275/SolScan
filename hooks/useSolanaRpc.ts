import { useEffect, useState } from "react";

const RPC = process.env.RPC_Url || "https://api.devnet.solana.com";

export const useSolanaRpc = <T>(method: string, params: any[]) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Removed the redundant arguments to avoid shadowing
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors on new requests
      
      try {
        const res = await fetch(RPC, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params,
          }),
        });
        
        const json = await res.json();
        
        // Safely extract the error message from the Solana response object
        if (json.error) {
           throw new Error(json.error.message || "Unknown RPC Error");
        }
        
        // ONLY update state if the component is still on the screen
        if (isMounted) {
          setData(json.result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || String(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [method, JSON.stringify(params)]);

  return { data, loading, error };
};