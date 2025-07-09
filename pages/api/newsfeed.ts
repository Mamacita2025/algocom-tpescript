import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave da NewsAPI não encontrada." });
  }

  const { q = "", country = "br", category = "general" } = req.query;

const queryParams = new URLSearchParams({
  ...(q ? { q: String(q) } : {}),
  country: String(country),
  category: String(category),
  pageSize: "10",
  apiKey,
});


  const url = `https://newsapi.org/v2/top-headlines?${queryParams.toString()}`;

  try {
    const { data }: { data: NewsApiResponse } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 8000, // ⏱️ Protege contra travamentos longos
    });

    if (!Array.isArray(data.articles)) {
      return res.status(500).json({ error: "Resposta inesperada da NewsAPI." });
    }

    res.status(200).json({ articles: data.articles });
} catch (err: unknown) {
  let errorMessage = "Erro desconhecido";
  let errorDetail: unknown = undefined;

  if (axios.isAxiosError(err)) {
    errorMessage = err.message;
    errorDetail = err.response?.data;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  console.error("🔴 Erro NewsAPI:", errorDetail || errorMessage || err);
  return res.status(500).json({
    error: "Falha ao conectar com a NewsAPI.",
    detalhe: errorDetail || errorMessage,
  });
}

}
