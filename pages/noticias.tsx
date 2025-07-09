import NewsFeed from "@/components/NewsFeed";
import { useEffect, useState } from "react";
import Link from "next/link";

type LocalNews = {
  _id: string;
  title: string;
  content: string;
  author?: string;
  category?: string;
  createdAt: string;
};

export default function NoticiasPage() {
  const [localNews, setLocalNews] = useState<LocalNews[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadLocalNews = async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      if (filter) query.append("category", filter);
      if (search) query.append("q", search);

      const res = await fetch(`/api/news/list?${query.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLocalNews((prev) => page === 1 ? data.news : [...prev, ...data.news]);
      setHasMore(data.news.length > 0);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    loadLocalNews();
  }, [page, filter, search]);

  return (
    <main className="container py-4">
      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>📰 Notícias do Portal</h1>

      <section style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar título ou conteúdo..."
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            width: "100%",
            maxWidth: "500px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "0.5rem", marginBottom: "1rem", borderRadius: "4px" }}
        >
          <option value="">Todas as categorias</option>
          <option value="tecnologia">💻 Tecnologia</option>
          <option value="saude">🧬 Saúde</option>
          <option value="educacao">📚 Educação</option>
          <option value="cultura">🎭 Cultura</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {localNews.length > 0 ? (
          localNews.map((noticia) => (
            <div key={noticia._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "18px" }}>{noticia.title}</h3>
              <p style={{ fontSize: "14px", color: "#444" }}>{noticia.content.slice(0, 150)}...</p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                {noticia.author && `🖋️ Autor: ${noticia.author}`}{" "}
                {noticia.category && `• Categoria: ${noticia.category}`}{" "}
                • {new Date(noticia.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <Link href={`/noticia/${noticia._id}`} style={{ fontSize: "14px", color: "#0070f3", textDecoration: "underline" }}>
                Ler notícia completa
              </Link>
            </div>
          ))
        ) : (
          <p>😕 Nenhuma notícia encontrada com esses filtros.</p>
        )}

        {hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            style={{ padding: "0.5rem 1rem", margin: "1rem 0", borderRadius: "4px" }}
          >
            ➕ Carregar mais
          </button>
        )}
      </section>

      <hr />

      <section>
        <h2 style={{ fontSize: "20px", marginBottom: "1rem" }}>🌍 Manchetes externas (NewsAPI)</h2>
        <NewsFeed />
      </section>
    </main>
  );
}
