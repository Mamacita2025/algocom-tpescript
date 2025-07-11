import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor", "leitor"], default: "leitor" },
  avatar: { type: String, default: "" }, // 👈 novo campo
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
export type User = {
  _id: string;
  username: string;
  email?: string;
  role: "admin" | "editor" | "leitor";
  avatar?: string; // 👈 novo campo
  createdAt: Date;
};