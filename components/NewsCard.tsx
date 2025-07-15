// components/NewsCard.tsx
"use client";

import React, { useState } from "react";
import SafeImage from "@/components/SafeImage";
import { useAuth } from "@/context/AuthContext";
import CommentsModal from "./CommentsModal";
import ContentModal from "./ContentModal";
import styles from "./NewsCard.module.css";
import PropellerAd from "./PropellerAd";
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
  id, title, content, author,
  views, likes = 0, likedBy = [],
  commentsCount, image, url,
  isUrgente = false,
}: Props) {
  const { user, token } = useAuth();
  const currentUserId = user?.userId ?? "";

  const [isLiked, setIsLiked]               = useState(likedBy.includes(currentUserId));
  const [likesCount, setLikesCount]         = useState(likes);
  const [commentsCountState, setCommentsCountState] = useState(commentsCount);

  const [showComments, setShowComments]     = useState(false);
  const [showContent, setShowContent]       = useState(false);
  const [fullContent, setFullContent]       = useState(content);
  const [loadingContent, setLoadingContent] = useState(false);
  const [externalUrl, setExternalUrl]       = useState<string | null>(null);

  const texto  = sanitize(content);
  const resumo = texto.length > 160 ? texto.slice(0, 160) + "…" : texto;

  async function handleLike(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); e.stopPropagation();
    if (!token) return alert("Você precisa estar logado para curtir.");
    try {
      const res = await fetch(`/api/news/${id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao curtir");
      setIsLiked(!isLiked);
      setLikesCount(c => c + (isLiked ? -1 : 1));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleCommentsClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); e.stopPropagation();
    setShowComments(true);
  }

  async function handleCardClick() {
    setShowContent(true); setLoadingContent(true); setExternalUrl(null);
    try {
      if (url) {
        const scrapeRes = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
        if (!scrapeRes.ok) throw new Error("Falha ao extrair conteúdo");
        const { content: scraped } = await scrapeRes.json();
        setFullContent(scraped); setExternalUrl(url);
      } else {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Falha ao buscar notícia completa");
        const { data } = await res.json();
        setFullContent(data.content);
      }
    } catch {
      setFullContent(content);
    } finally {
      setLoadingContent(false);
    }
  }

  function handleCommentAdded() {
    setCommentsCountState(c => c + 1);
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.card} ${isUrgente ? styles.urgent : ""}`}
        onClick={handleCardClick}
      >
        {image && (
          <SafeImage src={image} alt={title} fill containerStyle={{ position: "relative", width: "100%", height: 180 }} />
        )}
        <div className={styles.content}>
          <h3 className={styles.title} title={title}>{title}</h3>
          <p className={styles.text}>{resumo}</p>
        </div>
        <div className={styles.meta}>
          <span>👤 {author ?? "Anônimo"}</span>
          <span>👁️ {views}</span>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${isLiked ? styles.btnUnlike : styles.btnLike}`}
            onClick={handleLike}
          >
            {isLiked ? "💔 Descurtir" : "❤️ Curtir"} ({likesCount})
          </button>
          <button
            className={`${styles.btn} ${styles.btnComment}`}
            onClick={handleCommentsClick}
          >
            💬 Comentários ({commentsCountState})
          </button>
        </div>
      </div>

      {showComments && (
        <CommentsModal newsId={id} onClose={() => setShowComments(false)} onCommentAdded={handleCommentAdded} />
      )}
      {showContent && (
        <ContentModal title={title} content={loadingContent ? "<p>Carregando conteúdo…</p>" : fullContent} onClose={() => setShowContent(false)} externalUrl={externalUrl} />
      )}
       <PropellerAd
        zoneId={2962844}
        type="banner"
        style={{ width: "100%", maxWidth: 300, height: 250, margin: "1rem auto" }}
      />
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
