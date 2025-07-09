// import { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

type Props = {
  id: string;
  title: string;
  content: string;
  author?: string;
  views: number;
  likes: number;
  likedBy: string[];
  image?: string | null;
  url?: string;
};

// Função para limpar conteúdo externo suspeito
function sanitize(text: string): string {
  return text
    .replace(/window\.open.*?;/gi, "")
    .replace(/<[^>]*>/g, "") // remove tags HTML
    .replace(/return\s+false;/gi, "")
    .replace(/\{[\s\S]*?\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function NewsCard({
  id,
  title,
  content,
  author,
  views,
  likes,
  likedBy,
  image,
  url,
}: Props) {
  const isExternal = id.startsWith("api-");
  const texto = isExternal ? sanitize(content) : content;
  const resumo = texto.length > 160 ? texto.slice(0, 160) + "..." : texto;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Imagem */}
      {image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            marginBottom: "0.75rem",
            borderRadius: "8px",
            overflow: "hidden",
            objectFit: "cover",
          }}
        >
          <SafeImage
            src={image}
            alt={title}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Título */}
      <h3 style={{ fontSize: "18px", marginBottom: "0.5rem" }}>{title}</h3>

      {/* Conteúdo resumido */}
      <p style={{ fontSize: "14px", color: "#444", marginBottom: "0.75rem" }}>
        {resumo}
      </p>

      {/* Informações */}
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "0.5rem" }}>
        <span>👤 {author || "Anônimo"}</span> &nbsp;•&nbsp;
        <span>👁️ {views}</span> &nbsp;•&nbsp;
        <span>
          ❤️ {likes} {likedBy.length > 0 && `(${likedBy.length} usuários)`}
        </span>
      </div>

      {/* Ações */}
      {isExternal ? (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <button
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "13px",
                borderRadius: "6px",
                border: "1px solid #aaa",
                background: "#e4ffe8",
                cursor: "pointer",
                marginTop: "0.4rem",
              }}
            >
              Ver fonte completa 🔗
            </button>
          </a>
        ) : (
          <p style={{ fontSize: "13px", color: "#999" }}>Fonte indisponível.</p>
        )
      ) : (
        <Link href={`/noticia/${id}`}>
          <button
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#f0f0f0",
            }}
          >
            Ler mais
          </button>
        </Link>
      )}
    </div>
  );
}
