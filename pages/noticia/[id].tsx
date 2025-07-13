// pages/noticias/[id].tsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

type NewsLocal = { title: string; content: string; image?: string };
type ScrapeRes  = { content: string };

export default function NewsDetailPage() {
  const { query, isReady } = useRouter();
  const { id, url } = query as { id: string; url?: string };

  const [title, setTitle]         = useState("Notícia");
  const [fullContent, setContent] = useState("");
  const [img, setImg]             = useState<string>();
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!isReady) return;

    setLoading(true);
    setError("");

    (async () => {
      try {
        if (url) {
          // externa → scraping
          const res = await fetch(
            `/api/extract?url=${encodeURIComponent(url)}`
          );
          if (!res.ok) throw new Error("Falha ao extrair conteúdo.");
          const data = (await res.json()) as ScrapeRes;
          setTitle("Notícia Externa");
          setContent(data.content);
        } else {
          // local → fetch interno
          const res = await fetch(`/api/news/${id}`);
          if (!res.ok) throw new Error("Notícia não encontrada.");
          const json = (await res.json()) as { data: NewsLocal };
          setTitle(json.data.title);
          setContent(json.data.content);
          setImg(json.data.image);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message || "Erro ao carregar notícia.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, url, isReady]);

  if (loading) return <p>Carregando notícia...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <article style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>{title}</h1>

      {img && (
        <div
          style={{
            margin: "1rem 0",
            width: "100%",
            height: 300,
            position: "relative",
          }}
        >
          <Image
            src={img}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{ lineHeight: 1.6, color: "#333" }}
        dangerouslySetInnerHTML={{ __html: fullContent }}
      />

      {url && (
        <p style={{ marginTop: "1rem" }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3", textDecoration: "underline" }}
          >
            ▶ Ver no site original
          </a>
        </p>
      )}
    </article>
  );
}
