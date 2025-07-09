import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
  user: { type: String }, // ou ObjectId para usuários registrados
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
