import { useCallback, useEffect, useState } from 'react';
import { fetchDomains } from './api';
import type { Domain } from './types';

interface DomainsState {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  /** Re-fetch from TonAPI (e.g. after a renewal is confirmed on-chain). */
  refresh: () => void;
}

/**
 * Load the connected wallet's domains. Refetches whenever the address changes
 * and exposes a manual refresh. Passing an empty address clears the list.
 */
export function useDomains(address: string): DomainsState {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!address) {
      setDomains([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDomains(address)
      .then((result) => {
        if (!cancelled) setDomains(result);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address, reloadKey]);

  return { domains, loading, error, refresh };
}
