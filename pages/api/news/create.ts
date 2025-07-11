import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  let user;
  try {
    user = verifyToken(req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }

  const { title, content, category, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Título e conteúdo obrigatórios." });

  try {
    const novaNoticia = await News.create({
      title,
      content,
      category: category || "geral",
      tags: tags || [],
      hidden: false,
      author: user.id
    });

    res.status(201).json({ data: novaNoticia });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Erro interno." });
  }
}
