import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  language: String,
  tags: [String],
  shared: {
    type: Boolean,
    default: false, // snippets are not shared by default
  },
});

export const Snippet =
  mongoose.models.Snippet || mongoose.model("Snippet", snippetSchema);
