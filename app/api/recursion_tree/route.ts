import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return NextResponse.json(
      {
        success: false,
        error: "Server config error: GEMINI_API_KEY is missing.",
      },
      { status: 500 }
    );
  }

  const { code, input } = await req.json();

  try {
    const prompt = `
Analyze the following code:

${code}

For the given input:

${input}

Generate a recursion tree of the above code in JSON format for the given recursive function. 
The JSON should have the following structure:

{
  "function": "name of the recursive function",
  "params": { ...all input parameters of the function... },
  "result": <optional computed value at this step>,
  "children": [ ...same structure for recursive calls; [] if base case... ]
}
Return ONLY valid JSON, with no explanations or markdown.
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        params: { key: GEMINI_API_KEY },
      }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Invalid response format from Gemini API");
    }

    console.log("Gemini rawText:", rawText);

    // For now you’re just returning the raw text; you can later JSON.parse it if the model returns pure JSON
    return NextResponse.json({
      success: true,
      data: {
        rawText,
      },
    });
  } catch (error: unknown) {
    // Axios / Gemini specific handling
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      console.error(
        "Gemini API error:",
        status,
        JSON.stringify(error.response.data, null, 2)
      );

      if (status === 429) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Model provider rate limit / quota exceeded. Please wait a bit and try again.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Upstream Gemini API error",
          details: error.response.data,
        },
        { status }
      );
    }

    // Non-Axios or unknown error
    console.error("Unexpected error in /api/recursion_tree:", error);

    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
