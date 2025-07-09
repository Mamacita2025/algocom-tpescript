import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";

type NewsItem = {
  _id: string;
  title: string;
  content: string;
  author?: string | { username: string };
  views: number;
  likes: number;
  likedBy?: string[];
  image?: string | null;
   url?: string;
};

export default function Home() {
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [externalNews, setExternalNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [verMaisLocal, setVerMaisLocal] = useState(false);
  const [verMaisExterna, setVerMaisExterna] = useState(false);

  const maxExibir = 8;

  useEffect(() => {
    fetch("/api/news/list")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data.news) ? data.news : [];

        const locais = items.filter((item: NewsItem) => !item._id.startsWith("api-"));
        const externas = items.filter((item: NewsItem) => item._id.startsWith("api-"));

        setLocalNews(locais);
        setExternalNews(externas);
      })
      .catch(() => setError("Erro ao carregar notícias."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>🕓 Carregando conteúdo...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalLocal = localNews.length;
  const totalExterna = externalNews.length;

  const exibidosLocal = verMaisLocal ? totalLocal : Math.min(maxExibir, totalLocal);
  const exibidosExterna = verMaisExterna ? totalExterna : Math.min(maxExibir, totalExterna);

  return (
    <section style={{ padding: "1rem" }}>
      {/* 📰 Notícias Locais */}
      <h1 style={{ fontSize: "24px", marginBottom: "0.5rem" }}>📰 Notícias Nacional(Angola)</h1>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "1rem" }}>
        Exibindo {exibidosLocal} de {totalLocal}
      </p>

      {totalLocal === 0 ? (
        <p>Nenhuma notícia local encontrada.</p>
      ) : (
        <>
          {(verMaisLocal ? localNews : localNews.slice(0, maxExibir)).map((item) => (
            <NewsCard
              key={item._id}
              id={item._id}
              title={item.title}
              content={item.content}
              author={typeof item.author === "string" ? item.author : item.author?.username}
              views={item.views}
              likes={item.likes}
              likedBy={item.likedBy || []}
              image={item.image}
            />
          ))}
          {totalLocal > maxExibir && (
            <button
              onClick={() => setVerMaisLocal(!verMaisLocal)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background: "#f0f0f0",
              }}
            >
              {verMaisLocal ? "Ver menos" : "Ver mais"}
            </button>
          )}
        </>
      )}

      {/* 🌍 Manchetes Externas */}
      <hr style={{ margin: "2rem 0", border: "1px solid #ccc" }} />
      <h2 style={{ fontSize: "20px", marginBottom: "0.5rem" }}>🌍 Manchetes Internacionais (Mundo)</h2>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "1rem" }}>
        Exibindo {exibidosExterna} de {totalExterna}
      </p>

      {totalExterna === 0 ? (
        <p>Nenhuma manchete externa disponível.</p>
      ) : (
        <>
          {(verMaisExterna ? externalNews : externalNews.slice(0, maxExibir)).map((item) => (
            <NewsCard
              key={item._id}
              id={item._id}
              title={item.title}
              content={item.content}
              author={typeof item.author === "string" ? item.author : item.author?.username}
              views={item.views}
              likes={item.likes}
              likedBy={item.likedBy || []}
              image={item.image}
               url={item.url || ""}
            />
          ))}
          {totalExterna > maxExibir && (
            <button
              onClick={() => setVerMaisExterna(!verMaisExterna)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background: "#f0f0f0",
              }}
            >
              {verMaisExterna ? "Ver menos" : "Ver mais"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
