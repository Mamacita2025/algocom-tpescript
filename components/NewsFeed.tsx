// components/NewsFeed.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import NewsCard from "./NewsCard";
import styles from "./NewsFeed.module.css";
type Article = {
  title:        string;
  description?: string;
  url:          string;
  urlToImage?:  string;
  source:       { name: string };
  publishedAt:  string;
  content?:     string;
};

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [country, setCountry]   = useState("br");
  const [category, setCategory] = useState("general");

  function isUrgente(title: string): boolean {
    return /urgente|breaking|última hora/i.test(title);
  }

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ country, category });
    if (search) params.append("q", search);

    try {
      const res  = await fetch(`/api/newsfeed?${params}`);
      const json = await res.json() as { articles: Article[]; error?: string };
      if (!res.ok) throw new Error(json.error || "Erro ao buscar notícias.");
      setArticles(json.articles);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
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
    <section className={styles.container}>
      <h2 className={styles.heading}>🌍 Manchetes Globais</h2>

      <div className={styles.filters}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar..."
          className={styles.input}
        />
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="br">🇧🇷 Brasil</option>
          <option value="us">🇺🇸 EUA</option>
          <option value="pt">🇵🇹 Portugal</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="general">🗞️ Geral</option>
          <option value="technology">💻 Tecnologia</option>
          <option value="business">📈 Negócios</option>
          <option value="health">🧬 Saúde</option>
          <option value="sports">🏆 Esportes</option>
          <option value="science">🔬 Ciência</option>
        </select>
        <button onClick={loadNews}  className={styles.btnRefresh}>
          🔄 Atualizar
        </button>
      </div>

      {loading && <p className={styles.state}>📰 Carregando manchetes...</p>}
      {error && (
        <div className={`${styles.state} ${styles.error}`}>
          <p>❌ {error}</p>
          <button onClick={loadNews}>🔁 Tentar novamente</button>
        </div>
      )}
      {!loading && !error && articles.length === 0 && (
        <p className={styles.state}>😕 Sem notícias.</p>
      )}

      {destacados.length > 0 && (
        <>
         <h3 className={styles.subheading}>🎠 Destaques</h3>
          <div className={styles.navControls}>
            <button onClick={() => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })}>◀️</button>
            <button onClick={() => carouselRef.current?.scrollBy({ left:  300, behavior: "smooth" })}>▶️</button>
          </div>
          <div ref={carouselRef} className={styles.carousel}>
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

      {restantes.length > 0 && (
        <>
           <h3 className={styles.subheading}>📰 Mais Notícias</h3>
          <div className={styles.feedList}>
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
          </div>
        </>
      )}

    
    </section>
  );
}
