import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const config = {
  api: { bodyParser: false },
};

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error("JWT_SECRET não definido.");

async function parseForm(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT");
    return res.status(405).json({ error: "Use método PUT" });
  }

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token não enviado" });

  let payload: any;
  try {
    payload = jwt.verify(auth.replace("Bearer ", ""), SECRET);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }

  await connectDB();

  try {
    const { fields, files } = await parseForm(req);
    const updates: any = {};

    if (fields.username) {
      updates.username = String(fields.username);
    }

    if (files.avatar) {
      const file = Array.isArray(files.avatar)
        ? files.avatar[0]
        : files.avatar;
      const fileName = path.basename(file.filepath);
      updates.avatar = `/uploads/${fileName}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      updates,
      { new: true, select: "username role avatar" }
    ).lean();

    return res.status(200).json({ user: updatedUser });
  } catch (err: any) {
    console.error("Erro em /api/user/update:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
