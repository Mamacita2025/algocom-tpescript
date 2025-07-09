import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  userId: string;
  username: string;
  role: string;
};

export default function CriarNoticia() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role !== "admin") {
        router.push("/noticias"); // ou "/"
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const body = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/news/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Erro desconhecido.");

      router.push(`/noticia/${result.data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>
        📝 Criar Nova Notícia
      </h1>

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
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Conteúdo"
          rows={6}
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoria (opcional)"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags separadas por vírgula"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Publicar"}
        </button>
      </form>
    </section>
  );
}
