// pages/index.tsx
"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import AdSense from "@/components/AdSense";
import styles from "@/styles/Home.module.css";
import PropellerAd from "@/components/PropellerAd";
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
  const [news, setNews]       = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("/api/news/list")
      .then(res => res.json())
      .then(data => setNews(data.news || []))
      .catch(() => setError("Erro ao carregar notícias."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className={styles.centered}>🕓 Carregando notícias…</p>;
  }
  if (error) {
    return <p className={`${styles.centered} ${styles.error}`}>{error}</p>;
  }

  return (
    <main className={styles.main}>
            <PropellerAd zoneId={2962844} type="popunder" />
      <h1 className={styles.title}>📰 Últimas Notícias</h1>

      <div className="ad-container mb-4">
        <AdSense slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT!} />
      </div>

      <div className={styles.grid}>
        {news.map(item => (
          <div key={item._id} className={styles.cardWrapper}>
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
