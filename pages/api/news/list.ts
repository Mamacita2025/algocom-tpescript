// pages/api/news/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { connectDB } from "@/lib/mongodb";
import News, { INews } from "@/models/News";
import User from "@/models/User";
import Comment from "@/models/Comment";
import type { FilterQuery } from "mongoose";

/** DTO enviado ao cliente */
interface NewsDTO {
  _id: string;
  title: string;
  content: string;
  image?: string | null;
  url: string;
  category?: string;
  createdAt: string;
  author?: { username: string; avatar: string };
  commentsCount: number;
  likes: number;
  likedBy: string[];
}

/** Estrutura de artigo da NewsAPI */
interface NewsApiArticle {
  title: string;
  description?: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ news?: NewsDTO[]; error?: string }>
) {
  await connectDB();

  const { category, q, page = "1" } = req.query;
  const filters: FilterQuery<INews> = {};

  if (typeof category === "string" && category) {
    filters.category = category;
  }
  if (typeof q === "string" && q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limit = 10;
  const skip = (pageNum - 1) * limit;

  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.error("Missing NEWSAPI_KEY");
    return res
      .status(500)
      .json({ error: "Chave da NewsAPI não encontrada no ambiente" });
  }

  try {
    // 1) Notícias locais com contagem de comentários
    const localRaw = await News.aggregate([
      { $match: filters },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "newsId",
          as: "commentsArr",
        },
      },
      { $addFields: { commentsCount: { $size: "$commentsArr" } } },
      { $project: { commentsArr: 0 } },
    ]);

    // 2) Popula author
    const localPopulated = await User.populate(localRaw, {
      path: "author",
      select: "username avatar",
    });

    // 3) Mapeia para NewsDTO (incluindo likes e likedBy)
    const localNews: NewsDTO[] = localPopulated.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      image: doc.image ?? null,
      url: doc.url!,
      category: doc.category ?? "local",
      createdAt: doc.createdAt.toISOString(),
      author: doc.author
        ? { username: doc.author.username, avatar: doc.author.avatar }
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commentsCount: (doc as any).commentsCount || 0,
      likes: doc.likes,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      likedBy: doc.likedBy.map((id: { toString: () => any; }) => id.toString()),
    }));

    // 4) Manchetes externas via NewsAPI
    const resp = await axios.get<{ articles: NewsApiArticle[] }>(
      "https://newsapi.org/v2/top-headlines",
      { params: { sources: "techcrunch", apiKey, pageSize: limit, q } }
    );

    // 5) Mapeia externo para NewsDTO
    const externalNews: NewsDTO[] = [];
    for (const art of resp.data.articles) {
      const raw = await News.findOneAndUpdate<INews>(
        { url: art.url },
        {
          $setOnInsert: {
            title: art.title,
            content: art.content || art.description || "",
            image: art.urlToImage,
            url: art.url,
            category: "external",
            createdAt: new Date(art.publishedAt),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
        .lean()
        .exec();
      if (!raw) continue;

      const commentsCount = await Comment.countDocuments({
        newsId: raw._id,
      });

      externalNews.push({
        _id: raw._id.toString(),
        title: raw.title,
        content: raw.content,
        image: raw.image ?? null,
        url: raw.url!,
        category: raw.category ?? "external",
        createdAt: raw.createdAt.toISOString(),
        author: undefined,
        commentsCount,
        likes: raw.likes,
        likedBy: raw.likedBy.map((id) => id.toString()),
      });
    }

    return res.status(200).json({ news: [...localNews, ...externalNews] });
  } catch (error: unknown) {
    console.error("Erro em /api/news/list:", error);
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ error: msg });
  }
}
