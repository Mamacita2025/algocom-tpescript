"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useRouter } from "next/router";

type User = {
  userId: string;
  username: string;
  role: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const { user } = await res.json();
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    setLoading(true);

    // 1) autentica
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      throw new Error(data.error || "Falha no login");
    }
    localStorage.setItem("token", data.token);

    // 2) busca user e atualiza contexto
    const meRes = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${data.token}` },
      cache: "no-store"
    });
    const meData = await meRes.json();
    if (!meRes.ok) {
      localStorage.removeItem("token");
      setLoading(false);
      throw new Error(meData.error || "Falha ao obter usuário");
    }
    setUser(meData.user);

    // 3) redireciona
    if (meData.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/noticias");
    }

    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
