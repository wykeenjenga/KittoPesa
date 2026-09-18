import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { useRates } from '../contexts/RatesContext';
import type { Product } from '../types';

export function useProducts() {
  const { rates } = useRates();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts(rates?.usdToKes ?? 129.5)
      .then(setProducts)
      .catch(() => setError('Could not load products. Check your connection and try again.'))
      .finally(() => setLoading(false));
  }, [rates?.usdToKes]);

  useEffect(() => {
    load();
    // Only reload when the rate actually changes (or on mount), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates?.usdToKes]);

  return { products, loading, error, reload: load };
}
