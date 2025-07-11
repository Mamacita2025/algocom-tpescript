import mongoose, { Schema, Document, Model } from "mongoose";

export  interface INews extends Document {
  title: string;
  content: string;
  category?: string;
  author?: mongoose.Types.ObjectId;
  likes: number;
  views: number;
  likedBy: mongoose.Types.ObjectId[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  url?: string;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

const News: Model<INews> = mongoose.models.News || mongoose.model("News", NewsSchema);

export  default News;
