export type Rates = {
  usdToKes: number;
  usdToEur: number;
  fetchedAt: number;
  live: boolean;
};

const FALLBACK_USD_TO_KES = 129.5;
const FALLBACK_USD_TO_EUR = 0.87;

/** Free, no-key exchange rate API — real live rates, updated daily. */
export async function fetchRates(): Promise<Rates> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('rate fetch failed');
    const data = await res.json();
    const usdToKes = data?.rates?.KES ?? FALLBACK_USD_TO_KES;
    const usdToEur = data?.rates?.EUR ?? FALLBACK_USD_TO_EUR;
    return { usdToKes, usdToEur, fetchedAt: Date.now(), live: true };
  } catch {
    return {
      usdToKes: FALLBACK_USD_TO_KES,
      usdToEur: FALLBACK_USD_TO_EUR,
      fetchedAt: Date.now(),
      live: false,
    };
  }
}
