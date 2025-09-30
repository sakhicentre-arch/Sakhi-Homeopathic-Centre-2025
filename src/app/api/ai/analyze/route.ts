import { NextResponse } from 'next/server';

// This is the main function that will be called when our app makes a request
export async function POST(req: Request) {
  try {
    const { caseNotes } = await req.json();

    if (!caseNotes) {
      return NextResponse.json({ error: 'Case notes are required.' }, { status: 400 });
    }

    // --- Prepare the request to the Google AI API ---
    
    // IMPORTANT: You must have a GEMINI_API_KEY in your .env file for this to work
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // This is our instruction to the AI. It tells it how to behave.
    const systemPrompt = `
      You are an expert homeopathic assistant. Your role is to analyze a given set of case notes from a patient consultation. 
      Based on the notes, you must provide a concise analysis in three distinct parts:
      1.  **Key Symptoms:** List the most important and characteristic symptoms from the case notes.
      2.  **Potential Rubrics:** Suggest a few potential repertory rubrics that correspond to the key symptoms.
      3.  **Remedy Suggestions:** Provide a shortlist of 2-3 potential homeopathic remedies that cover the case, with a brief justification for each choice.
      Your entire response must be formatted as plain text, using markdown for headings and lists. Do not add any introductory or concluding sentences outside of this structure.
    `;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: caseNotes }]
      }],
    };

    // --- Make the API call to Google AI ---
    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
        const errorBody = await aiResponse.text();
        console.error("Google AI API Error:", errorBody);
        throw new Error(`Google AI API request failed with status ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    
    const analysisText = aiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error("Failed to extract analysis from AI response.");
    }
    
    // --- Send the AI's analysis back to our application ---
    return NextResponse.json({ analysis: analysisText });

  } catch (error: unknown) {
    console.error('Error in AI analysis route:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}