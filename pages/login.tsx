import { useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  userId: string;
  username: string;
  role: string;
};

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido.");

      localStorage.setItem("token", data.token);

      const decoded = jwtDecode<TokenPayload>(data.token);

      // Redireciona com base na função do usuário
      if (decoded.role === "admin") {
        router.push("/admin"); // ou /criar-noticia
      } else {
        router.push("/noticias"); // ✅ página padrão para usuário comum
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>🔐 Login de Usuário</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: "600px",
        }}
      >
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Senha"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Autenticando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
