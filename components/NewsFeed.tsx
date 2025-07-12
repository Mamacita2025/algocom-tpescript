// components/NewsFeed.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type Article = {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
};

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("br");
  const [category, setCategory] = useState("general");

  // True se o título indicar urgência
  const isUrgente = useCallback((title: string) =>
    /urgente|breaking|última hora/i.test(title),
  []);

  // Carrega a API de manchetes
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      country,
      category,
    });
    if (search) params.append("q", search);

    try {
      const res = await fetch(`/api/newsfeed?${params.toString()}`);
      const data = (await res.json()) as {
        articles: Article[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar notícias.");
      }
      setArticles(data.articles);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country, category, search]);

  // Executa ao montar e sempre que loadNews muda
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Referência para o carrossel
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll a cada 4s
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    const timer = setInterval(() => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const destacados = articles.slice(0, 5);
  const restantes = articles.slice(5);

  return (
    <section>
      <h2 style={{ fontSize: 20, marginBottom: "1rem" }}>
        🌍 Manchetes Globais
      </h2>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar por palavra-chave..."
          style={{
            padding: "0.5rem",
            flex: "1 1 300px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="br">🇧🇷 Brasil</option>
          <option value="us">🇺🇸 EUA</option>
          <option value="pt">🇵🇹 Portugal</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">🗞️ Geral</option>
          <option value="technology">💻 Tecnologia</option>
          <option value="business">📈 Negócios</option>
          <option value="health">🧬 Saúde</option>
          <option value="sports">🏆 Esportes</option>
          <option value="science">🔬 Ciência</option>
        </select>

        <button
          onClick={loadNews}
          style={{ padding: "0.5rem 1rem", borderRadius: 4 }}
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Estados */}
      {loading && <p>📰 Carregando manchetes...</p>}

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <p>❌ Erro: {error}</p>
          <button onClick={loadNews}>🔁 Tentar novamente</button>
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <p style={{ fontSize: 14 }}>
          😕 Nenhuma notícia encontrada com esses filtros.
        </p>
      )}

      {/* Carrossel */}
      {destacados.length > 0 && (
        <>
          <h3 style={{ fontSize: 18, marginBottom: "0.5rem" }}>
            🎠 Manchetes em Destaque
          </h3>

          {/* Navegação manual */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <button
              onClick={() =>
                carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })
              }
            >
              ◀️
            </button>
            <button
              onClick={() =>
                carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" })
              }
            >
              ▶️
            </button>
          </div>

          <div
            ref={carouselRef}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              paddingBottom: "1rem",
              scrollSnapType: "x mandatory",
            }}
          >
            {destacados.map((article, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: 280,
                  flex: "0 0 auto",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  scrollSnapAlign: "start",
                  border: isUrgente(article.title) ? "2px solid red" : "none",
                }}
              >
                {article.urlToImage && (
                  <div
                    style={{ position: "relative", width: "100%", height: 180 }}
                  >
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                {isUrgente(article.title) && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "red",
                      color: "#fff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    🔴 Urgente
                  </span>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "0.5rem",
                    fontSize: 14,
                  }}
                >
                  {article.title}
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lista padrão */}
      {restantes.map((article, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontSize: 16 }}>{article.title}</h3>

          {article.urlToImage && (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 250,
                borderRadius: 4,
                overflow: "hidden",
                marginTop: "0.5rem",
              }}
            >
              <Image
                src={article.urlToImage}
                alt={article.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <p style={{ fontSize: 14 }}>
            {article.description || "Sem descrição disponível."}
          </p>

          <p style={{ fontSize: 12, color: "#666" }}>
            Fonte: {article.source.name} •{" "}
            {new Date(article.publishedAt).toLocaleString()}
          </p>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 14,
              color: "#0070f3",
              textDecoration: "underline",
            }}
          >
            Ler na fonte original
          </a>
        </div>
      ))}
    </section>
  );
}
