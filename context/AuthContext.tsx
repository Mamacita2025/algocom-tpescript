import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  userId: string;
  username: string;
  role: string;
  avatar?: string;
};

type AuthContextType = {
  user: TokenPayload | null;
  logout: () => void;
};

// exporta o contexto para ser consumido diretamente (opcional)
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook para facilitar consumo do contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
