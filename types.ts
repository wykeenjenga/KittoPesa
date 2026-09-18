export type CardBrand = 'visa' | 'mastercard';

export type WalletCard = {
  id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  expiry: string; // MM/YY
  colors: [string, string];
  frozen?: boolean;
  isDefault?: boolean;
};

export type PaymentMethod = 'mpesa' | 'card' | 'applepay';

export type TransactionKind = 'pay' | 'send';

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  method: PaymentMethod;
  timestamp: number;
  kind: TransactionKind;
  category?: string;
  reference: string;
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  mpesa: 'M-Pesa',
  card: 'Card',
  applepay: 'Apple Pay',
};

export type Product = {
  id: string;
  name: string;
  price: number; // KES
  usdPrice: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  ratingCount: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  icon: 'card' | 'gift' | 'alert' | 'bag';
};

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  preparing: 'Preparing your order',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  placedAt: number;
  /** 0 (at the store) to 1 (at the destination) — drives the tracking view. */
  routeProgress: number;
  courierName: string;
  etaMinutes: number;
  transactionId: string;
};
