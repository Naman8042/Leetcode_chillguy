import { NextResponse } from "next/server";
import Resume from "@/models/resume"; 
import {connect} from "@/dbConfig/dbConfig"; 
import { getServerSession } from "next-auth";
import { option } from "../auth/[...nextauth]/option";

export async function POST(req: Request) {
  await connect();
  const body = await req.json();
  console.log(body)
  const session = await getServerSession(option);
  const userId = session?.user.id;
  const existing = await Resume.findOne({userId: userId});

  if (existing) {
  const updated = await Resume.findOneAndUpdate(
    { userId },
    body,
    { new: true } // return the updated document
  );
  return NextResponse.json({ found: true, data: updated });
}


  const created = await Resume.create({ ...body, userId:session?.user.id });
  return NextResponse.json({ found: false, data: created });
}


export async function GET() {
  const session = await getServerSession(option);
  const userId = session?.user.id

  console.log(userId)
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connect();

  const resume = await Resume.findOne({ userId });

  if (!resume) {
    return Response.json({ found: false, data: null });
  }

  return Response.json({ found: true, data: resume });
}