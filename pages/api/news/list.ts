import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import News, { INews } from "@/models/News";
import { FilterQuery } from "mongoose";

type Article = {
  title: string;
  description?: string;
  content?: string;
  source?: { name?: string };
  urlToImage?: string;
  url?: string;
};
function limparTexto(texto: string): string {
  return texto
    .replace(/window\.open.*?;/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { category, q, page = "1" } = req.query;
  const filters: FilterQuery<INews> = {};

  // 🔍 Filtros locais por categoria e busca textual
  if (category && typeof category === "string") {
    filters.category = category;
  }

  if (q && typeof q === "string") {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  const pageNumber = parseInt(page as string, 10) || 1;
  const limit = 10;
  const skip = (pageNumber - 1) * limit;

  try {
    // 📰 Consulta notícias locais do MongoDB
    const localNews = await News.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "username avatar", model: User })
      .select(
        "title content category author views likes likedBy createdAt image"
      );

    // 🌍 Consulta manchetes externas da NewsAPI com fallback
    let externalNews: INews[] = [];

    try {
      const externalRes = await axios.get(
        `https://newsapi.org/v2/everything?q=tesla&from=2025-06-08&sortBy=publishedAt&apiKey=e6b788e3b7574be7968cb1d5b185fc8f`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 8000,
        }
      );

      const externalData = externalRes.data;
      console.log("🔍 Status NewsAPI:", externalData.status);
      console.log("🔍 Total artigos:", externalData.articles?.length);

      externalNews = Array.isArray(externalData.articles)
        ? externalData.articles.map((item: Article, index: number) => ({
            _id: `api-${index}`,
            title: item.title,
            content: limparTexto(
              item.description || item.content || "Sem conteúdo."
            ),
            author: { username: item.source?.name || "Fonte externa" },
            views: 0,
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
            image: item.urlToImage || "",
            url: item.url || "",
          }))
        : [];
    } catch (externalError: unknown) {
      if (
        externalError &&
        typeof externalError === "object" &&
        ("code" in externalError || "message" in externalError)
      ) {
        const err = externalError as { code?: string; message?: string };
        console.warn(
          "⚠️ Falha ao buscar manchetes externas:",
          err.code || err.message
        );
      } else {
        console.warn("⚠️ Falha ao buscar manchetes externas:", externalError);
      }
      externalNews = []; // garante fallback seguro
    }

    // 📦 Retorna ambas fontes combinadas
    res.status(200).json({
      news: [...localNews, ...externalNews],
    });
  } catch (err) {
    console.error("Erro na API /news/list:", err);
    res.status(500).json({ error: "Erro ao carregar notícias." });
  }
}
