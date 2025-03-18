import { NextRequest, NextResponse } from "next/server";
import Parser from "tree-sitter";

export default async function POST(req: NextRequest,res:NextResponse) {
  const { code, language } = await req.json();

  try {
    const parser = new Parser();
    let langModule: Parser.Language;

    // Dynamically import the correct language module
    if (language === "javascript") {
      const JavaScript = await import("tree-sitter-javascript");
      langModule = JavaScript as unknown as Parser.Language;
    } else if (language === "python") {
      const Python = await import("tree-sitter-python");
      langModule = Python as unknown as Parser.Language;
    } else {
      return NextResponse.json({ error: "Unsupported language" });
    }

    parser.setLanguage(langModule);
    const tree = parser.parse(code);

    return  NextResponse.json({ ast: tree.rootNode.toString() });
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
