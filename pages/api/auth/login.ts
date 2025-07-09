import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const SECRET = process.env.JWT_SECRET || "minha-chave-super-secreta";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !user.password) return res.status(401).json({ error: "Credenciais inválidas." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Senha incorreta." });

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "1d" });
  res.status(200).json({ token });
}
