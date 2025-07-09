import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comentarios from "@/components/Comentarios";
import Image from "next/image";

type NewsItem = {
  _id: string;
  title: string;
  content: string;
  author?: { username?: string } | string;
  likes: number;
  views: number;
  createdAt?: string;
  image?: string;
};

export default function NoticiaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const idStr = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idStr) return;

    const isExternal = idStr.startsWith("api-");
    const endpoint = isExternal ? "/api/newsfeed" : `/api/news/${idStr}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (isExternal && Array.isArray(data.articles)) {
          const index = parseInt(idStr.replace("api-", ""), 10);
          const item = data.articles[index];
          if (item) {
            setNews({
              _id: idStr,
              title: item.title,
              content: item.content || item.description || "Conteúdo indisponível.",
              author: item.source?.name || "Fonte externa",
              likes: 0,
              views: 0,
              image: item.urlToImage || "",
            });
          } else {
            setError("Notícia externa não encontrada.");
          }
        } else if (data?.data) {
          setNews(data.data);
        } else {
          setError("Notícia não encontrada.");
        }
      })
      .catch(() => setError("Erro ao carregar notícia."))
      .finally(() => setLoading(false));
  }, [idStr]);

  if (loading) return <p>🕓 Carregando notícia...</p>;
  if (error || !news) return <p style={{ color: "red" }}>⚠️ {error}</p>;

  return (
    <article
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      {/* Imagem da notícia */}
      {news.image && (
        <div style={{ position: "relative", width: "100%", height: "300px", marginBottom: "1rem" }}>
          <Image
            src={news.image}
            alt={news.title}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: "6px" }}
          />
        </div>
      )}

      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>{news.title}</h1>

      <p style={{ fontSize: "15px", color: "#333", lineHeight: "1.6", marginBottom: "1rem" }}>
        {news.content}
      </p>

      <div style={{ fontSize: "13px", color: "#666" }}>
        {typeof news.author === "string"
          ? `🖋️ ${news.author}`
          : news.author?.username && `🖋️ ${news.author.username}`}{" "}
        | 👁️ {news.views} | ❤️ {news.likes}
        <br />
        {news.createdAt && (
          <>🗓️ Publicado em: {new Date(news.createdAt).toLocaleDateString("pt-BR")}</>
        )}
      </div>

      {/* Comentários apenas para notícias locais */}
      {!idStr.startsWith("api-") && <Comentarios newsId={news._id} />}
    </article>
  );
}
