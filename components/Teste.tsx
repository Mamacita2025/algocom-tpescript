import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";

type Article = {
  title: string;
  description?: string;
  source?: { name?: string };
};

export default function NewsFeedExternas() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/newsfeed")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 NewsAPI:", data);
        if (Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch(() => console.log("Erro ao buscar NewsAPI"));
  }, []);

  return (
    <section>
      <h2>🌍 Manchetes Globais</h2>
      {articles.length === 0 ? (
        <p>Nenhuma notícia externa encontrada.</p>
      ) : (
        articles.map((item, idx) => (
          <NewsCard
            key={idx}
            id={`api-${idx}`}
            title={item.title}
            content={item.description || "Sem descrição"}
            author={item.source?.name || "Fonte externa"}
            views={0}
            likes={0}
            likedBy={[]}
          />
        ))
      )}
    </section>
  );
}
