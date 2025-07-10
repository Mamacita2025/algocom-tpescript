import { useEffect, useState } from "react";
import NewsCard, { cardStyle } from "@/components/NewsCard";

type NewsItem = {
  _id: string;
  title: string;
  content: string;
  author?: string | { username: string };
  views: number;
  likes: number;
  likedBy?: string[];
  commentsCount?: number;
  image?: string | null;
  url?: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/news/list")
      .then((res) => res.json())
      .then((data) => setNews(data.news || []))
      .catch(() => setError("Erro ao carregar notícias."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={centered}>🕓 Carregando notícias…</p>;
  if (error) return <p style={{ ...centered, color: "red" }}>{error}</p>;

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>📰 Últimas Notícias</h1>

      <div style={gridStyle}>
        {news.map((item) => (
          <div key={item._id} style={cardWrapper}>
            <NewsCard
              id={item._id}
              title={item.title}
              content={item.content}
              author={
                typeof item.author === "string"
                  ? item.author
                  : item.author?.username
              }
              views={item.views}
              likes={item.likes}
              likedBy={item.likedBy || []}
              commentsCount={item.commentsCount || 0}
              image={item.image}
              url={item.url}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

// estilos inline

const centered: React.CSSProperties = {
  textAlign: "center",
  marginTop: "2rem",
};

const mainStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "2rem 1rem",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "1.5rem",
};

const cardWrapper: React.CSSProperties = {
  // opcional: garantir que o NewsCard preencha toda a célula
  display: "flex",
};
