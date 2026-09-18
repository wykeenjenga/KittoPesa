import { useState } from 'react';
import type { PaymentMethod, Transaction, WalletCard } from '../types';

const INITIAL_CARDS: WalletCard[] = [
  {
    id: 'seed-1',
    brand: 'visa',
    last4: '4821',
    holder: 'WYCLIFF K',
    expiry: '11/28',
    colors: ['#43cea2', '#185a9d'],
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

type PayRequest = {
  method: PaymentMethod;
  merchant?: string;
  amount?: number;
};

/**
 * All wallet state and actions live here, kept separate from the screens
 * that render it — similar to an ObservableObject / ViewModel in SwiftUI.
 * Screens just read values and call actions; none of them own the state.
 */
export function useWallet() {
  const [cards, setCards] = useState<WalletCard[]>(INITIAL_CARDS);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [payVisible, setPayVisible] = useState(false);
  const [payRequest, setPayRequest] = useState<PayRequest>({ method: 'mpesa' });
  const [addCardVisible, setAddCardVisible] = useState(false);

  const openPay = (request: PayRequest) => {
    setPayRequest(request);
    setPayVisible(true);
  };

  const closePay = () => setPayVisible(false);

  const completePayment = (merchant: string, amount: number, method: PaymentMethod) => {
    setTransactions((prev) => [
      { id: Date.now().toString(), merchant, amount, method, timestamp: Date.now() },
      ...prev,
    ]);
    setBalance((prev) => Math.max(0, prev - amount));
    setPayVisible(false);
  };

  const addCard = (card: WalletCard) => setCards((prev) => [...prev, card]);

  const resetDemo = () => {
    setCards(INITIAL_CARDS);
    setSelectedCardIndex(0);
    setBalance(INITIAL_BALANCE);
    setTransactions([]);
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
    resetDemo,
  };
}

export type WalletViewModel = ReturnType<typeof useWallet>;
