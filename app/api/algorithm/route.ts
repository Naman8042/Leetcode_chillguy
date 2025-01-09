import { NextRequest,NextResponse } from "next/server";
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
                  text: `Analyze the following problem: "${problemDescription}" and break it down into steps that explain the algorithm and visualization steps. Provide the algorithm steps in a structured format (e.g., 'compare', 'swap', 'merge') and describe what happens at each step.`,
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

      console.log(gptResponse)
      // Parse the algorithm steps from the response
      const steps =  parseStepsFromGeminiResponse(gptResponse);
  
  
      return NextResponse.json({steps});
    } catch (err: any) {
      console.error('Error', err);
      return NextResponse.json({
        success: false,
        error: err.message || 'Internal Server Error',
      });
    }
  }
  
  function parseStepsFromGeminiResponse(responseText: string) {
    const steps: { type: string; description: string }[] = [];
    
    // Split the response into lines
    const lines = responseText.split('\n');
  
    let currentStep: { type: string; description: string } | null = null;

    // Loop through the lines and extract meaningful steps
    lines.forEach((line) => {
        // Look for steps that are numbered
        if (line.match(/^(\d+)\./)) {
            // If there is an existing step, push the previous step into the steps array
            if (currentStep) {
                steps.push(currentStep);
            }

            // Start a new step
            currentStep = {
                type: 'generic',  // Default type, can be adjusted based on further logic
                description: line.replace(/^\d+\.\s*/, '') // Remove the step number
            };
        } else if (currentStep) {
            // If the line is part of the current step (additional details)
            currentStep.description += ' ' + line.trim();
        }
    });

    // Add the last step if exists
    if (currentStep) {
        steps.push(currentStep);
    }

    return steps;
}
