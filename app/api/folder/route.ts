import { Folder } from "@/models/folder";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
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

    if (!session || !session?.user) {
      return NextResponse.json({}, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }
    
    const folder = await Folder.findOne({ _id: folderId, userId: session.user.id }).select("snippets");
    
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json({ snippets: folder.snippets });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}
