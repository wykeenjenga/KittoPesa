import { Ionicons } from '@expo/vector-icons';
import type { OrderStatus, PaymentMethod } from './types';

export const METHOD_ICON: Record<PaymentMethod, keyof typeof Ionicons.glyphMap> = {
  mpesa: 'phone-portrait-outline',
  card: 'card-outline',
  applepay: 'logo-apple',
};

export const METHOD_COLOR: Record<PaymentMethod, string> = {
  mpesa: '#0f9d58',
  card: '#3b5bdb',
  applepay: '#111',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  placed: '#f5a623',
  preparing: '#3b5bdb',
  out_for_delivery: '#0f9d58',
  delivered: '#8a8f9a',
};
