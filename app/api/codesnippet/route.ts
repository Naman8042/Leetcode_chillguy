import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { option } from "../auth/[...nextauth]/option";
import { connect } from "@/dbConfig/dbConfig";
import {Folder} from '@/models/folder'

export  async function POST(req: NextRequest) {
  await connect();
  try{
    const session = await getServerSession(option);

    if (!session || !session?.user) {
      return NextResponse.json({}, { status: 401 });
    }
    console.log(session.user.id);

    const userId = session.user.id;

    const { name } = await req.json();

      if (!name || !userId) {
        return NextResponse.json({ error: "Name and userId are required" });
      }

      const newFolder = new Folder({ name, snippets: [], userId });
      await newFolder.save();

      return NextResponse.json({ message: "Folder created", folder: newFolder });
  }
  catch(err){
    console.log(err)
    return NextResponse.json(err)
  }
  
}

export async function GET() {
  await connect();
  try {
    const session = await getServerSession(option);

    if (!session || !session?.user) {
      return NextResponse.json({}, { status: 401 });
    }

    const userId = session.user.id;
    
    const folders = await Folder.find({ userId }).select("name");

    return NextResponse.json({ folders });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}
