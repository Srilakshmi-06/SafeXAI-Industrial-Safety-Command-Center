import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface SafeXUser {
  name: string;
  email: string;
}

interface StoredAccount {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: SafeXUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const STORAGE_KEY = 'safexai.accounts';
const SESSION_KEY = 'safexai.session';

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accts: StoredAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accts));
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeXUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as SafeXUser);
    } catch {
      /* ignore */
    }
  }, []);

  const persistSession = (u: SafeXUser | null) => {
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const fakeDelay = () => new Promise((r) => setTimeout(r, 650));

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    await fakeDelay();
    const accts = readAccounts();
    const exists = accts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setLoading(false);
      throw new Error('An account with this email already exists.');
    }
    const account: StoredAccount = { name, email, password };
    writeAccounts([...accts, account]);
    const u: SafeXUser = { name, email };
    setUser(u);
    persistSession(u);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    await fakeDelay();
    const accts = readAccounts();
    const match = accts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (!match) {
      setLoading(false);
      throw new Error('Invalid email or password.');
    }
    const u: SafeXUser = { name: match.name, email: match.email };
    setUser(u);
    persistSession(u);
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    persistSession(null);
  };

  const value = useMemo<AuthState>(
    () => ({ user, loading, error, signIn, signUp, signOut }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
