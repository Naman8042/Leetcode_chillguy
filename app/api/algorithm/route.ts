
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = 'AIzaSyAUguCatnzMGk_yC1P_Ks_uhEE6gHNsE14';


export async function POST(req: NextRequest) {
    try {
        const { problemDescription } = await req.json();

        console.log(problemDescription)

        if (!problemDescription) {
            return NextResponse.json({ error: 'Problem description is required' });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Analyze the following problem: "${problemDescription}" and break it down into structured algorithmic steps. Categorize each step based on its function, using specific types such as 'initialize', 'compare', 'swap', 'merge', 'loop', 'condition', 'output', etc. Provide a detailed explanation of each step, focusing on both the logic and the visualization aspect. The output should follow this format: { type: 'TYPE', description: 'DESCRIPTION' } for each step.`,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract the relevant content from the response
        const gptResponse = response.data.candidates[0].content.parts[0].text;
        console.log("GPT Response:", gptResponse); // Log the raw response for debugging

        const steps = parseStepsFromGeminiResponse(gptResponse);

        return NextResponse.json({ steps });

    } catch (err: unknown) {
        console.error('Error', err);
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';

        return NextResponse.json({
            success: false,
            error: errorMessage,
        });
    }
}

function parseStepsFromGeminiResponse(responseText: string) {
    const steps: { type: string; description: string }[] = [];
    
    // Regular expression to match each step with a type and description
    const stepRegex = /\*\*\{ type: '(.*?)', description: '(.*?)' \}\*\*/g;
    
    let match;
    while ((match = stepRegex.exec(responseText)) !== null) {
        const [, type, description] = match;
        steps.push({ type, description });
    }
    
    return steps;
}
