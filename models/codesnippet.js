import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  language: String,
  tags: [String],
});

export const Snippet =
  mongoose.models.Snippet || mongoose.model("Snippet", snippetSchema);
