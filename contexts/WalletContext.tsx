import { createContext, useContext } from 'react';
import { useWallet, WalletViewModel } from '../hooks/useWallet';

const WalletContext = createContext<WalletViewModel | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

/** Read shared wallet state/actions anywhere without prop drilling through navigators. */
export function useWalletCtx() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletCtx must be used within a WalletProvider');
  return ctx;
}
