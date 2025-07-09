import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type TokenPayload = {
  userId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    const noticia = await News.findById(id);
    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    const alreadyLiked = noticia.likedBy.includes(decoded.userId);
    if (alreadyLiked) {
      return res.status(409).json({ error: "Você já curtiu esta notícia." });
    }

    noticia.likes += 1;
    noticia.likedBy.push(decoded.userId);
    await noticia.save();

    return res.status(200).json({ message: "Like registrado com sucesso.", data: noticia });
  } catch (err) {
    console.error("Erro ao registrar like:", err);
    return res.status(500).json({ error: "Erro interno ao processar o like." });
  }
}
