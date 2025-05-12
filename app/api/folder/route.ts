import { Folder } from "@/models/folder";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { option } from "../auth/[...nextauth]/option";

export  async function POST(req: NextRequest) {
  await connect(); // Connect to the database

    try {
      const { title, description, code, language, tags ,folderId} = await req.json(); // Get snippet data from request body

      // Validate required fields
      if (!folderId) {
        return NextResponse.json({ error: "Folder ID is required" });
      }
      if (!title || !code || !language) {
        return NextResponse.json({ error: "Title, code, and language are required" });
      }

      // Find the folder by ID
      const folder = await Folder.findById(folderId);
      if (!folder) {
        return NextResponse.json({ error: "Folder not found" });
      }

      // Create a new snippet object
      const newSnippet = { title, description, code, language, tags: tags || [] };

      // Add the snippet to the folder's snippets array
      folder.snippets.push(newSnippet);

      // Save the updated folder
      await folder.save();

      // Return success response
      return NextResponse.json({ message: "Snippet added", newSnippet:newSnippet });
    } catch (error) {
      console.error("Error adding snippet:", error);
      return NextResponse.json({ error: "Error adding snippet", details: error });
    }  
}


export async function GET(req: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(option);
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json({ error: "Valid Folder ID is required" }, { status: 400 });
    }

    const folder = await Folder.findById(folderId).select("snippets shared userId");

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id === folder.userId.toString();

    if (!isOwner && !folder.shared) {
      return NextResponse.json({ error: "This folder is private and cannot be accessed" }, { status: 403 });
    }

    return NextResponse.json({ snippets: folder.snippets ,shared:folder.shared});

  } catch (err) {
    console.error("Error fetching snippets:", err);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}
