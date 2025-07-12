// pages/register.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const isJson = res.headers.get("content-type")?.includes("application/json");
      
      if (!isJson) {
        throw new Error("Resposta inválida do servidor.");
      }
      const data = isJson ? await res.json() : { error: res.statusText };
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      setSuccess("✅ Cadastro realizado com sucesso!");
      setForm({ username: "", email: "", password: "" });

      setTimeout(() => router.push("/login"), 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={mainStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🧑‍💻 Criar Conta</h1>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          <label style={labelStyle} htmlFor="username">
            Nome de usuário <span style={required}>*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="Digite seu username"
            style={inputStyle}
            required
          />

          <label style={labelStyle} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="seu@email.com"
            style={inputStyle}
          />

          <label style={labelStyle} htmlFor="password">
            Senha <span style={required}>*</span>
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
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p style={footerText}>
          <Link href="/login" style={linkStyle}>
            Entrar
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
  background: "#f5f5f5",
  padding: "2rem",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "2rem",
};

const titleStyle: React.CSSProperties = {
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

const required: React.CSSProperties = {
  color: "#e0245e",
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

const successStyle: React.CSSProperties = {
  background: "#e8f5e9",
  color: "#2e7d32",
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
