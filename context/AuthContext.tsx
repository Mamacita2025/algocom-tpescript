// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import { useRouter } from "next/router";

type User = {
  userId: string;
  username: string;
  role: string;
  avatar?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "username" | "avatar">>) => Promise<void>;
  setUser: (u: User | null) => void;    // <- exposto aqui
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // carrega token + user
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
        cache: "no-store"
      });
      if (!res.ok) throw new Error("Sessão inválida");
      const { user: fetchedUser } = await res.json();
      setToken(savedToken);
      setUser(fetchedUser);
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // login
  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha no login");

        localStorage.setItem("token", data.token);
        setToken(data.token);

        const meRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
          cache: "no-store"
        });
        const meData = await meRes.json();
        if (!meRes.ok) throw new Error(meData.error || "Falha ao obter usuário");

        setUser(meData.user);
        router.push(meData.user.role === "admin" ? "/admin" : "/noticias");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  // updateProfile (usa setUser internamente)
  const updateProfile = useCallback(
    async (data: Partial<Pick<User, "username" | "avatar">>) => {
      if (!token) throw new Error("Usuário não autenticado");
      setLoading(true);
      try {
        const res = await fetch("/api/auth/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Falha ao atualizar perfil");
        setUser(json.user);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateProfile,
        setUser        // <- aqui disponibilizamos setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
