import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_TOKEN;

export async function POST(req: NextRequest) {
  const { code, input } = await req.json();

  try {
    const prompt = `
Analyze the following code:

${code}

For the given input:

${input}

Provide a step-by-step dry run of the code execution.

Rules:
- If the code is correct → explain execution.
- If the code has mistakes → return corrected code first, then explain.

Include:
1. Current state of variables at each step
2. Decisions (conditions, recursion, loops)
3. Intermediate results
4. Final output

Format:
- Initial Input
- Execution Steps
- Intermediate Results
- Final Output

Return clear, structured text.
`;

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an expert programming tutor who explains code execution clearly.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText =
      response.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("Invalid response format from Hugging Face API");
    }

    return NextResponse.json({
      success: true,
      data: {
        rawText,
      },
    });
  } catch (error: unknown) {
    console.error("HF Error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: error.response?.data || error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
