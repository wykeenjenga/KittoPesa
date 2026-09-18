import type { Product } from '../types';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  SendMoney: undefined;
  CurrencyConverter: undefined;
  Calculator: undefined;
};

export type ShopStackParamList = {
  ShopMain: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Orders: undefined;
  OrderTracking: { orderId: string };
};

export type WalletStackParamList = {
  WalletMain: undefined;
  TransactionDetail: { transactionId: string };
  CardDetail: { cardId: string };
  Insights: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  PersonalInfo: undefined;
  LinkedAccounts: undefined;
  Security: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ShopTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};
