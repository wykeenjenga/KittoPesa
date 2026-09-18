export type CardBrand = 'visa' | 'mastercard';

export type WalletCard = {
  id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  expiry: string; // MM/YY
  colors: [string, string];
};

export type PaymentMethod = 'mpesa' | 'card' | 'applepay';

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  method: PaymentMethod;
  timestamp: number;
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  mpesa: 'M-Pesa',
  card: 'Card',
  applepay: 'Apple Pay',
};

export type Product = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
};
