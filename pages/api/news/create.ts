// pages/api/news/create.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { verifyToken, IJwtUser } from "@/lib/auth";

type CreateNewsResponse = 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { data: any }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateNewsResponse>
) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  let user: IJwtUser;
  try {
    user = verifyToken(req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }

  const { title, content, category, tags } = req.body as {
    title?: unknown;
    content?: unknown;
    category?: unknown;
    tags?: unknown;
  };

  if (typeof title !== "string" || typeof content !== "string") {
    return res
      .status(400)
      .json({ error: "Título e conteúdo obrigatórios." });
  }

  try {
    const novaNoticia = await News.create({
      title,
      content,
      category: typeof category === "string" ? category : "geral",
      tags: Array.isArray(tags) ? tags : [],
      hidden: false,
      author: user.userId,   // ← usa userId, não id
    });

    return res.status(201).json({ data: novaNoticia });
  } catch (error) {
    console.error("Erro criando notícia:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
}
