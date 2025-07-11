import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
  newsId: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    newsId: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
