import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
type Comentario = {
  _id: string;
  user: string;
  text: string;
};

type Props = {
  newsId: string;
};

type TokenPayload = {
  username: string;
};

export default function Comentarios({ newsId }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Recupera nome do autor logado via token
  const getUsernameFromToken = (): string => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return "Anônimo";
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.username || "Anônimo";
    } catch {
      return "Anônimo";
    }
  };

  useEffect(() => {
    fetch(`/api/comments/${newsId}`)
      .then(res => res.json())
      .then(data => setComentarios(data.data || []))
      .catch(() => setError("Erro ao carregar comentários."));
  }, [newsId]);

  const enviarComentario = async () => {
    if (!texto.trim()) return;

    setLoading(true);
    setError("");

    const nomeAutor = getUsernameFromToken();

    try {
      const res = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId, user: nomeAutor, text: texto })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao comentar.");

      setComentarios((prev) => [data.data, ...prev]);
      setTexto("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
      <h3 style={{ fontSize: "18px", marginBottom: "0.75rem" }}>💬 Comentários</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: "1rem" }}>
        {comentarios.length === 0 && <li>Nenhum comentário ainda.</li>}
        {comentarios.map((c) => (
          <li key={c._id} style={{ marginBottom: "0.5rem", background: "#f9f9f9", padding: "0.5rem", borderRadius: "4px" }}>
            <strong>{c.user}</strong>: {c.text}
          </li>
        ))}
      </ul>

      <textarea
        rows={3}
        placeholder="Escreva um comentário..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", resize: "vertical" }}
      />
      <button onClick={enviarComentario} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Enviando..." : "Enviar comentário"}
      </button>
    </section>
  );
}
