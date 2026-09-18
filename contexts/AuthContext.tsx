import { createContext, useContext, useMemo, useState } from 'react';
import { AuthUser, loginRequest, requestPasswordReset, signupRequest } from '../api/auth';

type AuthStatus = 'idle' | 'loading';

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (name: string) => void;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setStatus('loading');
    setError(null);
    try {
      const u = await loginRequest(email, password);
      setUser(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      throw e;
    } finally {
      setStatus('idle');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setStatus('loading');
    setError(null);
    try {
      const u = await signupRequest(name, email, password);
      setUser(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      throw e;
    } finally {
      setStatus('idle');
    }
  };

  const resetPassword = async (email: string) => {
    setStatus('loading');
    setError(null);
    try {
      await requestPasswordReset(email);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      throw e;
    } finally {
      setStatus('idle');
    }
  };

  const updateProfile = (name: string) => {
    setUser((prev) => (prev ? { ...prev, name } : prev));
  };

  const logout = () => setUser(null);
  const clearError = () => setError(null);

  const value = useMemo(
    () => ({ user, status, error, login, signup, resetPassword, updateProfile, logout, clearError }),
    [user, status, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
