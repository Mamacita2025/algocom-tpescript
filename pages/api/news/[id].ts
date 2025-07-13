// pages/api/news/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import News, { INews } from "@/models/News";

type DataOut = {
  data?: {
    _id:       string;
    title:     string;
    content:   string;
    author:    { username: string } | string;
    views:     number;
    likes:     number;
    createdAt: string;
    image?:    string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataOut>
) {
  await connectDB();

  const { id } = req.query;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  // Já sabemos que `id` é string
  const idStr = id as string;

  try {
    // 1) Buscar documento e popular author.username
    const newsDoc = await News.findById(idStr)
      .populate<{ author: { username: string } }>("author", "username")
      .lean<INews & { author?: { username: string }; hidden?: boolean }>()
      .exec();

    if (!newsDoc || newsDoc.hidden) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    // 2) Incrementar contagem de views
    await News.findByIdAndUpdate(idStr, { $inc: { views: 1 } });

    // 3) Definir author de forma segura
    let authorField: { username: string } | string = "Anônimo";
    if (
      newsDoc.author &&
      typeof newsDoc.author === "object" &&
      "username" in newsDoc.author
    ) {
      authorField = { username: newsDoc.author.username };
    }

    // 4) Responder com payload completo, usando idStr em vez de newsDoc._id
    return res.status(200).json({
      data: {
        _id:       idStr,
        title:     newsDoc.title,
        content:   newsDoc.content,
        author:    authorField,
        views:     (newsDoc.views ?? 0) + 1,
        likes:     newsDoc.likes ?? 0,
        createdAt: newsDoc.createdAt!.toISOString(),
        image:     newsDoc.image ?? undefined,
      },
    });
  } catch (err) {
    console.error("Erro ao buscar notícia:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
}
