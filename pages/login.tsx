// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // encapsula POST /api/auth/login + GET /api/auth/me + redirect
      await login(form.username, form.password);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main style={mainStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>🔐 Acessar Conta</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          <label style={labelStyle} htmlFor="username">
            Nome de usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="Seu usuário"
            style={inputStyle}
            required
          />

          <label style={labelStyle} htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="••••••••"
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={footerText}>
          Não tem conta?{" "}
          <Link href="/register" style={linkStyle}>
            Registre-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}

// ====== Estilos inline ======

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f0f2f5",
  padding: "2rem",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  background: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "2rem",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.75rem",
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#333",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "0.5rem",
  padding: "0.75rem",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#fff",
  background: "#0070f3",
  border: "none",
  borderRadius: "4px",
  transition: "background 0.2s",
};

const errorStyle: React.CSSProperties = {
  background: "#fdecea",
  color: "#b71c1c",
  padding: "0.75rem 1rem",
  borderRadius: "4px",
  marginBottom: "1rem",
};

const footerText: React.CSSProperties = {
  marginTop: "1.5rem",
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#555",
};

const linkStyle: React.CSSProperties = {
  color: "#0070f3",
  textDecoration: "none",
  fontWeight: 500,
};
