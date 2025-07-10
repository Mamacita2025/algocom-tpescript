// pages/api/news/list.ts

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import News, { INews } from "@/models/News";
import Comment from "@/models/Comment";
import { FilterQuery, Types } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { category, q, page = "1" } = req.query;
  const filters: FilterQuery<INews> = {};

  if (category && typeof category === "string") filters.category = category;
  if (q && typeof q === "string") {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limit = 10, skip = (pageNum - 1) * limit;

  try {
    // Busca local com aggregate para commentsCount
    const localAgg = await News.aggregate([
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

    // popula author
    const localNews = await User.populate(localAgg, {
      path: "author",
      select: "username avatar",
    });

    // Manchetes externas…
    const externalWithCounts: Array<any> = [];
    const resp = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: { sources: "techcrunch", apiKey: process.env.NEWSAPI_KEY, pageSize: limit, q },
    });
    for (const art of resp.data.articles) {
      const doc = await News.findOneAndUpdate(
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
      ).lean();

      const cnt = await Comment.countDocuments({ newsId: (doc as any)._id });
      externalWithCounts.push({ ...(doc as any), commentsCount: cnt });
    }

    return res.status(200).json({
      news: [...localNews, ...externalWithCounts],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao carregar notícias." });
  }
}
