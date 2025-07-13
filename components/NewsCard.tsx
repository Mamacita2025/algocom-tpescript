// components/NewsCard.tsx
"use client";

import React, { useState } from "react";
import SafeImage from "@/components/SafeImage";
import { useAuth } from "@/context/AuthContext";
import CommentsModal from "./CommentsModal";
import ContentModal from "./ContentModal";

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
  isUrgente?: boolean;
};

export default function NewsCard({
  id,
  title,
  content,
  author,
  views,
  likes = 0,
  likedBy = [],
  commentsCount,
  image,
  url,
  isUrgente = false,
}: Props) {
  const { user, token } = useAuth();
  const currentUserId = user?.userId ?? "";

  const [isLiked, setIsLiked] = useState(likedBy.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(likes);
  const [commentsCountState, setCommentsCountState] =
    useState(commentsCount);

  const [showComments, setShowComments]     = useState(false);
  const [showContent, setShowContent]       = useState(false);
  const [fullContent, setFullContent]       = useState<string>(content);
  const [loadingContent, setLoadingContent] = useState(false);
  const [externalUrl, setExternalUrl]       = useState<string | null>(null);

  const texto  = sanitize(content);
  const resumo = texto.length > 160 ? texto.slice(0, 160) + "…" : texto;

  async function handleLike(e: React.MouseEvent<HTMLButtonElement>) {
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
      if (!res.ok) throw new Error(data.error ?? "Falha ao curtir");
      setIsLiked(!isLiked);
      setLikesCount(c => c + (isLiked ? -1 : 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  function handleCommentsClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(true);
  }

  async function handleCardClick() {
    setShowContent(true);
    setLoadingContent(true);
    setExternalUrl(null);

    try {
      if (url) {
        // externa (inclui feed): scraping
        const scrapeRes = await fetch(
          `/api/extract?url=${encodeURIComponent(url)}`
        );
        if (!scrapeRes.ok) throw new Error("Falha ao extrair conteúdo");
        const { content: scraped } = await scrapeRes.json();
        setFullContent(scraped);
        setExternalUrl(url);
      } else {
        // local: fetch do nosso backend
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Falha ao buscar notícia completa");
        const { data } = await res.json();
        setFullContent(data.content);
      }
    } catch (err) {
      console.error("Erro ao buscar conteúdo completo", err);
      setFullContent(content);
    } finally {
      setLoadingContent(false);
    }
  }

  function handleCommentAdded() {
    setCommentsCountState(c => c + 1);
  }

  const CardInner = (
    <div
      style={{
        ...cardStyle,
        border: isUrgente ? "2px solid red" : undefined,
      }}
      onClick={handleCardClick}
    >
      {image && (
        <SafeImage
          src={image}
          alt={title}
          fill
          containerStyle={imgWrapperStyle}
        />
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
          💬 Comentários ({commentsCountState})
        </button>
      </div>
    </div>
  );

  return (
    <div style={wrapperStyle}>
      {CardInner}

      {showComments && (
        <CommentsModal
          newsId={id}
          onClose={() => setShowComments(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {showContent && (
        <ContentModal
          title={title}
          content={
            loadingContent
              ? "<p>Carregando conteúdo…</p>"
              : fullContent
          }
          onClose={() => setShowContent(false)}
          externalUrl={externalUrl}
        />
      )}
    </div>
  );
}

function sanitize(text: string): string {
  return text
    .replace(/window\.open.*?;/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/return\s+false;/gi, "")
    .replace(/\{[\s\S]*?\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ===== estilos inline =====
const wrapperStyle: React.CSSProperties = { width: "100%" };
const cardStyle: React.CSSProperties = {
  cursor:        "pointer",
  display:       "flex",
  flexDirection: "column",
  background:    "#fff",
  borderRadius:  10,
  boxShadow:     "0 2px 8px rgba(0,0,0,0.1)",
  overflow:      "hidden",
  transition:    "transform 0.2s, box-shadow 0.2s",
};
const imgWrapperStyle: React.CSSProperties = {
  position:   "relative",
  width:      "100%",
  height:     180,
  flexShrink: 0,
};
const contentWrapper: React.CSSProperties = {
  padding:      "1rem",
  flexGrow:     1,
  display:      "flex",
  flexDirection:"column",
};
const titleStyle: React.CSSProperties = {
  fontSize:     "1.1rem",
  margin:       "0 0 0.5rem",
  color:        "#222",
  lineHeight:   1.3,
  whiteSpace:   "nowrap",
  overflow:     "hidden",
  textOverflow: "ellipsis",
};
const textStyle: React.CSSProperties = {
  fontSize:        "0.9rem",
  color:           "#555",
  margin:          0,
  lineHeight:      1.4,
  display:         "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow:        "hidden",
};
const metaStyle: React.CSSProperties = {
  display:        "flex",
  justifyContent: "space-between",
  padding:        "0 1rem",
  fontSize:       "0.8rem",
  color:          "#777",
};
const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap:     "0.5rem",
  padding: "0.75rem 1rem 1rem",
};
const baseBtn: React.CSSProperties = {
  flex:         1,
  padding:      "0.5rem",
  borderRadius: 6,
  border:       "1px solid",
  background:   "#fff",
  fontSize:     "0.9rem",
  cursor:       "pointer",
  transition:   "background 0.2s",
};
const likeBtnStyle: React.CSSProperties = {
  ...baseBtn,
  borderColor: "#e0245e",
  color:       "#e0245e",
};
const commentBtnStyle: React.CSSProperties = {
  ...baseBtn,
  borderColor: "#0070f3",
  color:       "#0070f3",
};
