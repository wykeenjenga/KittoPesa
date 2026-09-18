import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchRates, Rates } from '../api/rates';

type RatesContextValue = {
  rates: Rates | null;
  loading: boolean;
  reload: () => void;
};

const RatesContext = createContext<RatesContextValue | null>(null);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchRates()
      .then(setRates)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => ({ rates, loading, reload: load }), [rates, loading, load]);

  return <RatesContext.Provider value={value}>{children}</RatesContext.Provider>;
}

export function useRates() {
  const ctx = useContext(RatesContext);
  if (!ctx) throw new Error('useRates must be used within a RatesProvider');
  return ctx;
}
