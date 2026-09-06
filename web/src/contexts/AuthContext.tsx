import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getToken, request, setToken } from "../lib/api";
import type { Session, User } from "../lib/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (input: { username: string; name: string; password: string }) => Promise<void>;
  loginWithSuapCode: (code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    request<User>("/auth/me")
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const start = useCallback((session: Session) => {
    setToken(session.token);
    setUser(session.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (username, password) => {
        start(await request<Session>("/auth/login", { method: "POST", body: { username, password } }));
      },
      register: async (input) => {
        start(await request<Session>("/auth/register", { method: "POST", body: input }));
      },
      loginWithSuapCode: async (code) => {
        start(await request<Session>("/auth/suap/callback", { method: "POST", body: { code } }));
      },
      logout: () => {
        setToken(null);
        setUser(null);
      },
    }),
    [user, loading, start]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro de AuthProvider.");
  }

  return context;
}
