// components/NewsCard.tsx
"use client";

import React, { useState } from "react";
import SafeImage from "@/components/SafeImage";
import { useAuth } from "@/context/AuthContext";
import CommentsModal from "./CommentsModal";

type Props = {
  id: string;
  title: string;
  content: string;
  author?: string;
  views: number;
  likes?: number;
  likedBy?: string[];
  commentsCount: number;
  image?: string | null;
  url?: string;
};

export default function NewsCard({
  id,
  title,
  content,
  author,
  views,
  likes,
  likedBy,
  commentsCount,
  image,
  url,
}: Props) {
  const { user, token } = useAuth();
  const currentUserId = user?.userId ?? "";

  const [isLiked, setIsLiked] = useState(likedBy?.includes(currentUserId));
  const [likesCount, setLikesCount] = useState<number>(likes? likes : 0);
  const [showComments, setShowComments] = useState(false);

  const texto = sanitize(content);
  const resumo = texto.length > 160 ? texto.slice(0, 160) + "…" : texto;

  // Clicou no botão de curtir
  async function handleLike(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Você precisa estar logado para curtir.");
      return;
    }

    try {
      const res = await fetch(`/api/news/${id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao curtir");
      setIsLiked(!isLiked);
      setLikesCount((c) => c + (isLiked ? -1 : 1));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Clicou no botão de comentários
  function handleCommentsClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(true);
  }

  const CardInner = (
    <div style={cardStyle}>
      {image && (
        <div style={imgWrapperStyle}>
          <SafeImage src={image} alt={title} style={imgStyle} />
        </div>
      )}
      <div style={contentWrapper}>
        <h3 style={titleStyle} title={title}>
          {title}
        </h3>
        <p style={textStyle}>{resumo}</p>
      </div>
      <div style={metaStyle}>
        <span>👤 {author ?? "Anônimo"}</span>
        <span>👁️ {views}</span>
      </div>
      <div style={actionsStyle}>
        <button style={likeBtnStyle} onClick={handleLike}>
          {isLiked ? "💔 Descurtir" : "❤️ Curtir"} ({likesCount})
        </button>
        <button style={commentBtnStyle} onClick={handleCommentsClick}>
          💬 Comentários ({commentsCount})
        </button>
      </div>
    </div>
  );

  return (
    <div style={wrapperStyle}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          {CardInner}
        </a>
      ) : (
        CardInner
      )}
      {showComments && (
        <CommentsModal newsId={id} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
}

// Sanitização simples de HTML/JS
function sanitize(text: string): string {
  return text
    .replace(/window\.open.*?;/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/return\s+false;/gi, "")
    .replace(/\{[\s\S]*?\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ========================
// Estilos inline (como antes)
// ========================
const wrapperStyle: React.CSSProperties = { width: "100%" };
const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
};
const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  overflow: "hidden",
  width: "100%",
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
};
const imgWrapperStyle: React.CSSProperties = {
  width: "100%",
  height: 180,
  overflow: "hidden",
  flexShrink: 0,
};
const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const contentWrapper: React.CSSProperties = {
  padding: "1rem",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
};
const titleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  margin: "0 0 0.5rem",
  color: "#222",
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const textStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#555",
  margin: 0,
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};
const metaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 1rem",
  fontSize: "0.8rem",
  color: "#777",
};
const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  padding: "0.75rem 1rem 1rem",
};
const baseBtn: React.CSSProperties = {
  flex: 1,
  padding: "0.5rem",
  borderRadius: 6,
  border: "1px solid",
  background: "#fff",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.2s",
};
const likeBtnStyle: React.CSSProperties = {
  ...baseBtn,
  borderColor: "#e0245e",
  color: "#e0245e",
};
const commentBtnStyle: React.CSSProperties = {
  ...baseBtn,
  borderColor: "#0070f3",
  color: "#0070f3",
};
