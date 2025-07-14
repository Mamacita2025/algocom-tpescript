// pages/noticias.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import NewsFeed from "@/components/NewsFeed";
import styles from "@/styles/Noticias.module.css";

type LocalNews = {
  _id: string;
  title: string;
  content: string;
  author?: string;
  category?: string;
  createdAt: string;
  views: number;
  likes: number;
  likedBy?: string[];
  commentsCount: number;
  image?: string | null;
};

export default function NoticiasPage() {
  const [localNews, setLocalNews] = useState<LocalNews[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 10;

  const loadLocalNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (filter) params.append("category", filter);
      if (search) params.append("q", search);

      const res = await fetch(`/api/news/list?${params}`);
      const data = (await res.json()) as { news: LocalNews[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Falha ao carregar notícias");

      setLocalNews((prev) =>
        page === 1 ? data.news : [...prev, ...data.news]
      );
      setHasMore(data.news.length === PAGE_SIZE);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    loadLocalNews();
  }, [loadLocalNews]);

  return (
     <main className={styles.container}>
      <h1 className={styles.title}>📰 Notícias do Portal</h1>

      <section className={styles.section}>
        <div className={styles.controls}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar notícias..."
            className={styles.input}
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">Todas as categorias</option>
            <option value="tecnologia">💻 Tecnologia</option>
            <option value="saude">🧬 Saúde</option>
            <option value="educacao">📚 Educação</option>
            <option value="cultura">🎭 Cultura</option>
          </select>
        </div>

 {error && <p className={styles.errorText}>{error}</p>}
        {localNews.length > 0 ? (
          <>
            <div  className={styles.grid}>
              {localNews.map((n) => (
                <NewsCard
                  key={n._id}
                  id={n._id}
                  title={n.title}
                  content={n.content}
                  author={n.author}
                  views={n.views}
                  likes={n.likes}
                  likedBy={n.likedBy}
                  commentsCount={n.commentsCount ?? 0}
                  image={n.image}
                />
              ))}
            </div>

            {loading && <p className={styles.loading}>🕓 Carregando mais...</p>}

            {hasMore && !loading && (
              <button onClick={() => setPage((p) => p + 1)} className={styles.loadMoreBtn}>
                ➕ Carregar mais
              </button>
            )}
          </>
        ) : (
          <p className={styles.noResults}>😕 Nenhuma notícia encontrada.</p>
        )}
      </section>

      <hr className={styles.divider} />

        <section className={styles.external}>
        <h2 className={styles.subTitle}>🌍 Manchetes Externas</h2>
        <NewsFeed />
      </section>
    </main>
  );
}

