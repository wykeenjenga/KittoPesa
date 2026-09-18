import { useMemo, useState } from 'react';
import type {
  AppNotification,
  CartItem,
  PaymentMethod,
  Product,
  Transaction,
  TransactionKind,
  WalletCard,
} from '../types';

const INITIAL_CARDS: WalletCard[] = [
  {
    id: 'seed-1',
    brand: 'visa',
    last4: '4821',
    holder: 'WYCLIFF K',
    expiry: '11/28',
    colors: ['#43cea2', '#185a9d'],
    isDefault: true,
  },
  {
    id: 'seed-2',
    brand: 'mastercard',
    last4: '9012',
    holder: 'WYCLIFF K',
    expiry: '03/27',
    colors: ['#ee0979', '#ff6a00'],
  },
];

const INITIAL_BALANCE = 12450;

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Welcome to KittoPesa',
    body: 'Explore Shop, add a card, and try a demo payment.',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    read: false,
    icon: 'gift',
  },
  {
    id: 'n2',
    title: 'Live exchange rates added',
    body: 'Check the Convert tool on Home for real-time USD/EUR to KES rates.',
    timestamp: Date.now() - 1000 * 60 * 60 * 40,
    read: false,
    icon: 'alert',
  },
];

type PayRequest = {
  method: PaymentMethod;
  merchant?: string;
  amount?: number;
  kind?: TransactionKind;
  category?: string;
  fromCart?: boolean;
};

function makeReference() {
  return 'KP' + Math.random().toString(36).slice(2, 10).toUpperCase();
}

/**
 * All shared app state and actions live here — similar to an
 * ObservableObject / ViewModel in SwiftUI. Screens just read values and
 * call actions; none of them own this state directly.
 */
export function useWallet() {
  const [cards, setCards] = useState<WalletCard[]>(INITIAL_CARDS);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [payVisible, setPayVisible] = useState(false);
  const [payRequest, setPayRequest] = useState<PayRequest>({ method: 'mpesa' });
  const [addCardVisible, setAddCardVisible] = useState(false);

  const openPay = (request: PayRequest) => {
    setPayRequest(request);
    setPayVisible(true);
  };

  const closePay = () => setPayVisible(false);

  const pushNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      { ...n, id: Date.now().toString(), timestamp: Date.now(), read: false },
      ...prev,
    ]);
  };

  const completePayment = (merchant: string, amount: number, method: PaymentMethod) => {
    const kind = payRequest.kind ?? 'pay';
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        merchant,
        amount,
        method,
        timestamp: Date.now(),
        kind,
        category: payRequest.category,
        reference: makeReference(),
      },
      ...prev,
    ]);
    setBalance((prev) => Math.max(0, prev - amount));
    if (payRequest.fromCart) setCart([]);
    pushNotification({
      title: kind === 'send' ? 'Money sent' : 'Payment successful',
      body:
        kind === 'send'
          ? `You sent KES ${amount.toLocaleString()} to ${merchant}.`
          : `You paid KES ${amount.toLocaleString()} to ${merchant}.`,
      icon: 'card',
    });
    setPayVisible(false);
  };

  const addCard = (card: WalletCard) => setCards((prev) => [...prev, card]);

  const toggleCardFrozen = (id: string) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c)));

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setSelectedCardIndex(0);
  };

  const setDefaultCard = (id: string) => {
    setCards((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target) return prev;
      const rest = prev.filter((c) => c.id !== id);
      return [{ ...target, isDefault: true }, ...rest.map((c) => ({ ...c, isDefault: false }))];
    });
    setSelectedCardIndex(0);
  };

  // --- Cart ---
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    );
  };

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cart],
  );
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const checkoutCart = () => {
    if (cart.length === 0) return;
    openPay({
      method: 'mpesa',
      merchant: `KittoPesa Shop (${cartCount} item${cartCount === 1 ? '' : 's'})`,
      amount: cartTotal,
      kind: 'pay',
      category: 'Shopping',
      fromCart: true,
    });
  };

  // --- Notifications ---
  const markNotificationRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const resetDemo = () => {
    setCards(INITIAL_CARDS);
    setSelectedCardIndex(0);
    setBalance(INITIAL_BALANCE);
    setTransactions([]);
    setCart([]);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return {
    cards,
    selectedCardIndex,
    setSelectedCardIndex,
    balance,
    transactions,
    payVisible,
    payRequest,
    addCardVisible,
    setAddCardVisible,
    openPay,
    closePay,
    completePayment,
    addCard,
    toggleCardFrozen,
    removeCard,
    setDefaultCard,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    checkoutCart,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    resetDemo,
  };
}

export type WalletViewModel = ReturnType<typeof useWallet>;
