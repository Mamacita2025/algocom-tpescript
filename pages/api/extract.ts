// pages/api/extract.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { load } from "cheerio";

type DataOut = { content: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataOut>
) {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ content: "URL não fornecida." });
  }

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const html = await resp.text();

    // usa load em vez de cheerio.load
    const $ = load(html);

    // extrai texto de article > main > body
    let text = $("article").text().trim();
    if (!text) text = $("main").text().trim();
    if (!text) text = $("body").text().trim();
    if (!text) throw new Error("Sem conteúdo extraído");

    return res.status(200).json({ content: text });
  } catch (err) {
    console.error("Scraping error:", err);
    return res
      .status(200)
      .json({ content: "Não foi possível extrair conteúdo completo." });
  }
}
