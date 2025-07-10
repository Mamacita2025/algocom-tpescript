// components/CommentsModal.tsx

import { useEffect, useState, FormEvent } from "react";

type CommentType = {
  _id: string;
  text: string;
  user: { username: string; avatar?: string };
  createdAt: string;
};

export default function CommentsModal({
  newsId,
  onClose,
}: {
  newsId: string;
  onClose: () => void;
}) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newText, setNewText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Carrega comentários ao abrir
  useEffect(() => {
    fetch(`/api/news/${newsId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
      })
      .catch(() => {
        setError("Não foi possível carregar comentários.");
      });
  }, [newsId]);

  // Envia novo comentário
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;

    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/news/${newsId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar comentário.");
      }

      // o novo objeto vem com campo `user`
      setComments((prev) => [data.comment, ...prev]);
      setNewText("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          ✖
        </button>
        <h2>Comentários</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <textarea
            rows={3}
            placeholder="Escreva seu comentário…"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={textareaStyle}
          />
          <button type="submit" style={submitBtnStyle}>
            Enviar
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}

        <ul style={listStyle}>
          {comments.map((c) => (
            <li key={c._id} style={itemStyle}>
              <div style={authorLineStyle}>
                <strong>{c.user.username}</strong>
                <span style={dateStyle}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={textStyle}>{c.text}</p>
            </li>
          ))}
          {comments.length === 0 && <p>Nenhum comentário ainda.</p>}
        </ul>
      </div>
    </div>
  );
}

// ===== Estilos inline =====

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  padding: "1rem 1.5rem",
  position: "relative",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  background: "transparent",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  marginBottom: "1rem",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "vertical",
};

const submitBtnStyle: React.CSSProperties = {
  alignSelf: "flex-end",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  border: "none",
  background: "#0070f3",
  color: "#fff",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginBottom: "0.75rem",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const itemStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "0.75rem 0",
};

const authorLineStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  color: "#555",
  marginBottom: "0.25rem",
};

const dateStyle: React.CSSProperties = {
  fontStyle: "italic",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#333",
};
