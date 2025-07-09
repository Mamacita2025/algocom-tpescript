import { useEffect, useState } from "react";

type Article = {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
};

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("br");
  const [category, setCategory] = useState("general");

  const isUrgente = (title: string) =>
    /urgente|breaking|última hora/i.test(title);

  const loadNews = async () => {
    setLoading(true);
    setError("");

    const query = new URLSearchParams();
    query.append("country", country);
    query.append("category", category);
    if (search) query.append("q", search);

    try {
        const res = await fetch(`/api/newsfeed?${query.toString()}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Erro ao buscar notícias.");
        setArticles(data.articles);
        // console.log("Artigos recebidos:", data.articles);
    } catch (err: any) {
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      loadNews();
  }, [country, category]);

  useEffect(() => {
    const container = document.querySelector(".carrossel");
    if (!container) return;

    const interval = setInterval(() => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }, 4000);

    return () => clearInterval(interval);
}, []);

  const destacados = articles.slice(0, 5);
  const restantes = articles.slice(5);
  
  return (
      <section>
      <h2 style={{ fontSize: "20px", marginBottom: "1rem" }}>
        🌍 Manchetes Globais
      </h2>

      {/* 🔍 Filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar por palavra-chave..."
          style={{ padding: "0.5rem", flex: "1 1 300px", borderRadius: "4px", border: "1px solid #ccc" }}
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
        <button onClick={loadNews} style={{ padding: "0.5rem 1rem", borderRadius: "4px" }}>
          🔄 Atualizar
        </button>
      </div>

      {/* 🔄 Estado */}
      {loading && <p>📰 Carregando manchetes...</p>}
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <p>❌ Erro: {error}</p>
          <button onClick={loadNews}>🔁 Tentar novamente</button>
        </div>
      )}
      {!loading && articles.length === 0 && !error && (
        <p style={{ fontSize: "14px" }}>😕 Nenhuma notícia encontrada com esses filtros.</p>
      )}

      {/* 🎠 Carrossel */}
      {destacados.length > 0 && (
        <>
          <h3 style={{ fontSize: "18px", marginBottom: "0.5rem" }}>🎠 Manchetes em Destaque</h3>

          {/* Botões de navegação */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button onClick={() => document.querySelector(".carrossel")?.scrollBy({ left: -300, behavior: "smooth" })}>◀️</button>
            <button onClick={() => document.querySelector(".carrossel")?.scrollBy({ left: 300, behavior: "smooth" })}>▶️</button>
          </div>

          <div
            className="carrossel"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              paddingBottom: "1rem",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
            }}
          >
            {destacados.map((article, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: "280px",
                  flex: "0 0 auto",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  scrollSnapAlign: "start",
                  border: isUrgente(article.title) ? "2px solid red" : "none",
                }}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt="imagem"
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                )}
                {isUrgente(article.title) && (
                  <span style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    background: "red",
                    color: "#fff",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}>
                    🔴 Urgente
                  </span>
                )}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "0.5rem",
                  fontSize: "14px",
                }}>
                  {article.title}
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  cursor: "pointer",
                }} />
              </div>

))}
          </div>
        </>
      )}

      {/* 📄 Lista padrão */}
      {restantes.map((article, idx) => (
          <div
          key={idx}
          style={{
              border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
          >
          <h3 style={{ fontSize: "16px" }}>{article.title}</h3>
          {article.urlToImage && (
              <img
              src={article.urlToImage}
              alt="Imagem da notícia"
              style={{
                  width: "100%",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                maxHeight: "250px",
                objectFit: "cover",
            }}
            />
          )}
          <p style={{ fontSize: "14px" }}>{article.description || "Sem descrição disponível."}</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            Fonte: {article.source.name} • {new Date(article.publishedAt).toLocaleString()}
          </p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
              fontSize: "14px",
              color: "#0070f3",
              textDecoration: "underline",
            }}>
            Ler na fonte original
          </a>
        </div>
      ))}
    </section>
  );
}
