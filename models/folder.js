import mongoose from "mongoose";

// Define Snippet Schema first
const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true },
  language: { type: String, required: true },
  tags: [String],
});

// Define Folder Schema
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  snippets: [snippetSchema], // Use the schema after defining it
  userId: { type: String, required: true },
  shared: {
    type: Boolean,
    default: false, // snippets are not shared by default
  },
});

// Create Models
export const Snippet = mongoose.models.Snippet || mongoose.model("Snippet", snippetSchema);
export const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
