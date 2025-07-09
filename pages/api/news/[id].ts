import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const news = await News.findById(id).populate("author", "username");
    if (!news || news.hidden) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }
    res.status(200).json({ data: news });
  } catch (err) {
    console.error("Erro ao buscar notícia:", err);
    res.status(500).json({ error: "Erro interno." });
  }
}
