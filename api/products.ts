import type { Product } from '../types';

type RawProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

/** Real public product catalog — fakestoreapi.com, no key required. */
export async function fetchProducts(usdToKes: number): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) throw new Error('Failed to load products');
  const raw: RawProduct[] = await res.json();
  return raw.map((p) => ({
    id: String(p.id),
    name: p.title,
    usdPrice: p.price,
    price: Math.round(p.price * usdToKes),
    image: p.image,
    description: p.description,
    category: p.category,
    rating: p.rating?.rate ?? 0,
    ratingCount: p.rating?.count ?? 0,
  }));
}
