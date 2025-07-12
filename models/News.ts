// models/News.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  category?: string;
  author?: Types.ObjectId;
  likes: number;
  hidden: boolean;
  views: number;
  likedBy: Types.ObjectId[];
  image?: string | null;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title:    { type: String, required: true },
    content:  { type: String, required: true },
    category: { type: String, default: null },
    author:   { type: Schema.Types.ObjectId, ref: "User", required: false },

    likes:    { type: Number, default: 0 },
    views:    { type: Number, default: 0 },
    hidden:   { type: Boolean, default: false },

    likedBy:  {
      type:    [Schema.Types.ObjectId],
      ref:     "User",
      default: [],
    },

    image: { type: String, default: null },
    url:   { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Evita recompilar modelo em hot-reload ou em múltiplos imports
const News: Model<INews> =
  mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;
