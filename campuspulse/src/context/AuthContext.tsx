import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState, User } from '../types';

// ============================================================
// Demo credentials (no backend required for MVP)
// ============================================================
const DEMO_ACCOUNTS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'student@campuspulse.com',
    password: '123456',
    user: { id: 'user-1', email: 'student@campuspulse.com', name: 'Alex Kumar', role: 'student' },
  },
  {
    email: 'admin@campuspulse.com',
    password: '123456',
    user: { id: 'user-2', email: 'admin@campuspulse.com', name: 'Dr. Priya Nair', role: 'admin' },
  },
];

const STORAGE_KEY = 'campuspulse_auth';

interface AuthContextValue extends AuthState {}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email.toLowerCase().trim() && a.password === password
    );

    if (account) {
      setUser(account.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
