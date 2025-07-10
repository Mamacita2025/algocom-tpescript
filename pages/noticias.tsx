// pages/noticias.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import NewsFeed from "@/components/NewsFeed";

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
  commentsCount?: number;
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

  const loadLocalNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (filter) params.append("category", filter);
      if (search) params.append("q", search);

      const res = await fetch(`/api/news/list?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLocalNews((prev) =>
        page === 1 ? data.news : [...prev, ...data.news]
      );
      setHasMore(data.news.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    loadLocalNews();
  }, [page, filter, search]);

  return (
    <main style={containerStyle}>
      <h1 style={titleStyle}>📰 Notícias do Portal</h1>

      <section style={sectionStyle}>
        <div style={controlsStyle}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar notícias..."
            style={inputStyle}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">Todas as categorias</option>
            <option value="tecnologia">💻 Tecnologia</option>
            <option value="saude">🧬 Saúde</option>
            <option value="educacao">📚 Educação</option>
            <option value="cultura">🎭 Cultura</option>
          </select>
        </div>

        {error && <p style={errorText}>{error}</p>}

        {localNews.length > 0 ? (
          <>
            <div style={gridStyle}>
              {localNews.map((n) => (
                <NewsCard
                  key={n._id}
                  id={n._id}
                  title={n.title}
                  content={n.content}
                  author={n.author}
                  views={n.views}
                  likes={n.likes}
                  likedBy={n.likedBy || []}
                  commentsCount={n.commentsCount || 0}
                  image={n.image}
                />
              ))}
            </div>

            {loading && <p>🕓 Carregando mais...</p>}

            {hasMore && !loading && (
              <button
                onClick={() => setPage((p) => p + 1)}
                style={loadMoreBtn}
              >
                ➕ Carregar mais
              </button>
            )}
          </>
        ) : (
          <p>😕 Nenhuma notícia encontrada.</p>
        )}
      </section>

      <hr style={divider} />

      <section style={{ marginTop: "2rem" }}>
        <h2 style={subTitleStyle}>🌍 Manchetes Externas</h2>
        <NewsFeed />
      </section>
    </main>
  );
}

// ===== Estilos =====

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "1rem",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  textAlign: "center",
  marginBottom: "1.5rem",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "3rem",
};

const controlsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
};

const inputStyle: React.CSSProperties = {
  flex: "1 1 200px",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const selectStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1rem",
};

const loadMoreBtn: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  borderRadius: "6px",
  border: "none",
  background: "#0070f3",
  color: "#fff",
  cursor: "pointer",
};

const divider: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #ddd",
};

const subTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1rem",
};

const errorText: React.CSSProperties = {
  color: "red",
  marginBottom: "1rem",
};
