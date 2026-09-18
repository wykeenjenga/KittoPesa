import { Ionicons } from '@expo/vector-icons';
import type { PaymentMethod } from './types';

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
