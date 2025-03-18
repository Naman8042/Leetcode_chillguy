import { NextRequest, NextResponse } from "next/server";


export default async function POST(req: NextRequest,res:NextResponse) {
  const { code, language } = await req.json();

  try {
    return NextResponse.json(code)
  } catch (error) {
     return NextResponse.json(
      {
        success: false,
        error: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
