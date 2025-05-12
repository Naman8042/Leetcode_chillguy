import { Folder } from "@/models/folder";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json({ error: "Valid Folder ID is required" }, { status: 400 });
    }

    const folder = await Folder.findById(folderId).select("shared");

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }


    return NextResponse.json({ shared:folder.shared});

  } catch (err) {
    console.error("Error fetching snippets:", err);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}
