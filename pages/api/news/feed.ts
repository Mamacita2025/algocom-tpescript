import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
// Adjust the import path if your models folder is at the project root
import News from "@/models/News";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const news = await News.find({ hidden: false }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ data: news });
  } catch (error) {
    console.error("Erro ao buscar feed:", error);
    res.status(500).json({ error: "Falha ao carregar feed." });
  }
}
