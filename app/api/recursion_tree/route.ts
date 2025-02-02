import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyAUguCatnzMGk_yC1P_Ks_uhEE6gHNsE14";

export async function POST(req: NextRequest) {
  const { code, input } = await req.json();

  try {
    const prompt = `
      
      Analyze the following code:
  
  ${code}
  
  For the given input:
  
  ${input}
  
  Generate a recursion tree of above code in JSON format for a given recursive function. The JSON should have the following structure:

"function": The name of the recursive function.
"params": An object containing all input parameters of the function.
"result" (optional): The computed value at this step, if applicable.
"children": A list of recursive calls made by this function, following the same structure. If the recursion ends, "children" should be an empty array
  
  `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Invalid response format from API");
    }

    // Parse execution trace - clean up markdown and formatting
    
    // Create textual tree representation

    return NextResponse.json({
      success: true,
      data: {
        // executionTrace,
        // textualTree,
        // recursionTree: jsonTree
        rawText,
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
