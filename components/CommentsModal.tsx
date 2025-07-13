// components/CommentsModal.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";

type CommentUser = {
  username: string;
  avatar?:  string;
};

type CommentType = {
  _id:      string;
  text:     string;
  user:     CommentUser;
  createdAt:string;
};

type CommentsModalProps = {
  newsId:         string;
  onClose:        () => void;
  onCommentAdded?: () => void;
};

export default function CommentsModal({
  newsId,
  onClose,
  onCommentAdded,
}: CommentsModalProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newText, setNewText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/news/${newsId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments ?? []);
      })
      .catch(() => {
        setError("Não foi possível carregar comentários.");
      });
  }, [newsId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;

    setError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch(`/api/news/${newsId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao enviar comentário.");
      }

      setComments((prev) => [data.comment, ...prev]);
      setNewText("");
      onCommentAdded?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={closeBtnStyle}
          aria-label="Fechar comentários"
        >
          ✖
        </button>
        <h2>Comentários</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label htmlFor="comment-text" style={{ display: "none" }}>
            Escreva seu comentário
          </label>
          <textarea
            id="comment-text"
            rows={3}
            placeholder="Escreva seu comentário…"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={textareaStyle}
            disabled={submitting}
          />
          <button
            type="submit"
            style={submitBtnStyle}
            disabled={submitting}
          >
            {submitting ? "Enviando…" : "Enviar"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}

        <ul style={listStyle}>
          {comments.length === 0 && <p>Nenhum comentário ainda.</p>}
          {comments.map((c) => (
            <li key={c._id} style={itemStyle}>
              <div style={authorLineStyle}>
                <strong>{c.user.username}</strong>
                <span style={dateStyle}>
                  {new Date(c.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
              <p style={textStyle}>{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position:      "fixed",
  top:           0,
  left:          0,
  right:         0,
  bottom:        0,
  background:    "rgba(0,0,0,0.4)",
  display:       "flex",
  justifyContent:"center",
  alignItems:    "center",
  zIndex:        1000,
};

const modalStyle: React.CSSProperties = {
  background:     "#fff",
  borderRadius:   8,
  width:          "90%",
  maxWidth:       500,
  maxHeight:      "80vh",
  overflowY:      "auto",
  padding:        "1rem 1.5rem",
  position:       "relative",
};

const closeBtnStyle: React.CSSProperties = {
  position:   "absolute",
  top:        8,
  right:      8,
  background: "transparent",
  border:     "none",
  fontSize:   "1.2rem",
  cursor:     "pointer",
};

const formStyle: React.CSSProperties = {
  display:        "flex",
  flexDirection:  "column",
  gap:            "0.5rem",
  marginBottom:   "1rem",
};

const textareaStyle: React.CSSProperties = {
  width:       "100%",
  padding:     "0.5rem",
  borderRadius:"4px",
  border:      "1px solid #ccc",
  resize:      "vertical",
};

const submitBtnStyle: React.CSSProperties = {
  alignSelf:   "flex-end",
  padding:     "0.5rem 1rem",
  borderRadius:"4px",
  border:      "none",
  background:  "#0070f3",
  color:       "#fff",
  cursor:      "pointer",
};

const errorStyle: React.CSSProperties = {
  color:         "red",
  marginBottom:  "0.75rem",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding:   0,
  margin:    0,
};

const itemStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding:      "0.75rem 0",
};

const authorLineStyle: React.CSSProperties = {
  display:        "flex",
  justifyContent: "space-between",
  fontSize:       "0.85rem",
  color:          "#555",
  marginBottom:   4,
};

const dateStyle: React.CSSProperties = {
  fontStyle: "italic",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color:  "#333",
};
