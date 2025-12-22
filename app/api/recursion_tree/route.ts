import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const HF_API_KEY = process.env.HUGGINGFACE_TOKEN;

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    console.error("HUGGINGFACE_TOKEN is not set");
    return NextResponse.json(
      {
        success: false,
        error: "Server config error: HUGGINGFACE_TOKEN is missing.",
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

Generate a recursion tree of the recursive function in STRICT JSON.

Required JSON format:
{
  "function": "functionName",
  "params": { "param": "value" },
  "result": "optional return value",
  "children": [ ...recursive calls ]
}

Rules:
- Base case → children must be []
- Return ONLY valid JSON
- No markdown
- No explanation
`;

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a compiler-level code analyzer that outputs only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = response.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("Invalid response format from Hugging Face API");
    }

    console.log("HF rawText:", rawText);

    // Optional: strict JSON extraction safety
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Model did not return valid JSON");
    }

    const recursionTree = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: recursionTree,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      console.error(
        "HF API error:",
        status,
        JSON.stringify(error.response.data, null, 2)
      );

      if (status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded. Please retry later.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Upstream Hugging Face API error",
          details: error.response.data,
        },
        { status }
      );
    }

    console.error("Unexpected error in /api/recursion_tree:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
