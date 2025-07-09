// models/Like.ts
import mongoose, { Schema, model, models } from "mongoose";

const likeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    newsId: { type: Schema.Types.ObjectId, ref: "News", required: true },
  },
  { timestamps: true }
);

// Evita recriar model em hot reload
const Like = models.Like || model("Like", likeSchema);

export default Like;
