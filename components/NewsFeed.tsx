// components/NewsFeed.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import NewsCard from "./NewsCard";

type Article = {
  title:       string;
  description?:string;
  url:         string;
  urlToImage?: string;
  source:      { name: string };
  publishedAt: string;
  content?:    string;
};

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [country, setCountry]   = useState("br");
  const [category, setCategory] = useState("general");

  // determinação de manchete urgente
  function isUrgente(title: string): boolean {
    return /urgente|breaking|última hora/i.test(title);
  }

  // busca as manchetes do NewsAPI
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ country, category });
    if (search) params.append("q", search);

    try {
      const res = await fetch(`/api/newsfeed?${params}`);
      const data = (await res.json()) as { articles: Article[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Erro ao buscar notícias.");
      setArticles(data.articles);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country, category, search]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // auto-scroll do carrossel
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = carouselRef.current;
    if (!c) return;
    const timer = setInterval(() => {
      c.scrollBy({ left: 300, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const destacados = articles.slice(0, 5);
  const restantes  = articles.slice(5);

  return (
    <section>
      <h2 style={{ fontSize: 20, marginBottom: "1rem" }}>
        🌍 Manchetes Globais
      </h2>

      {/* filtros */}
      <div style={filtersStyle}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar..."
          style={inputStyle}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="br">🇧🇷 Brasil</option>
          <option value="us">🇺🇸 EUA</option>
          <option value="pt">🇵🇹 Portugal</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">🗞️ Geral</option>
          <option value="technology">💻 Tecnologia</option>
          <option value="business">📈 Negócios</option>
          <option value="health">🧬 Saúde</option>
          <option value="sports">🏆 Esportes</option>
          <option value="science">🔬 Ciência</option>
        </select>
        <button onClick={loadNews} style={buttonStyle}>
          🔄 Atualizar
        </button>
      </div>

      {/* estados */}
      {loading && <p>📰 Carregando manchetes...</p>}
      {error && (
        <div style={errorStyle}>
          <p>❌ {error}</p>
          <button onClick={loadNews}>🔁 Tentar novamente</button>
        </div>
      )}
      {!loading && !error && articles.length === 0 && (
        <p style={{ fontSize: 14 }}>😕 Sem notícias.</p>
      )}

      {/* carrossel de destaque */}
      {destacados.length > 0 && (
        <>
          <h3 style={subTitleStyle}>🎠 Destaques</h3>
          <div style={navControlsStyle}>
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
          <div ref={carouselRef} style={carouselStyle}>
            {destacados.map((art, idx) => (
              <NewsCard
                key={`api-${idx}`}
                id={`api-${idx}`}
                title={art.title}
                content={art.content || art.description || ""}
                author={art.source.name}
                views={0}
                likes={0}
                likedBy={[]}
                commentsCount={0}
                image={art.urlToImage || null}
                url={art.url}
                isUrgente={isUrgente(art.title)}
              />
            ))}
          </div>
        </>
      )}

      {/* lista residual */}
      {restantes.map((art, idx) => (
        <NewsCard
          key={`api-${idx + 5}`}
          id={`api-${idx + 5}`}
          title={art.title}
          content={art.content || art.description || ""}
          author={art.source.name}
          views={0}
          likes={0}
          likedBy={[]}
          commentsCount={0}
          image={art.urlToImage || null}
          url={art.url}
          isUrgente={isUrgente(art.title)}
        />
      ))}
    </section>
  );
}

// ===== Estilos =====
const filtersStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap",
};
const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  flex: "1 1 300px",
  borderRadius: 4,
  border: "1px solid #ccc",
};
const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: 4,
  cursor: "pointer",
};
const errorStyle: React.CSSProperties = {
  color: "red",
  marginBottom: "1rem",
};
const subTitleStyle: React.CSSProperties = {
  fontSize: 18,
  marginBottom: "0.5rem",
};
const navControlsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.5rem",
  marginBottom: "0.5rem",
};
const carouselStyle: React.CSSProperties = {
  display: "flex",
  overflowX: "auto",
  gap: "1rem",
  paddingBottom: "1rem",
  scrollSnapType: "x mandatory",
};
