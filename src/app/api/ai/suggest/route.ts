// src/app/api/ai/suggest/route.ts
import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function POST(request: Request) {
  try {
    // Initialize Vertex AI with project and location from .env file
    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT!,
      location: process.env.GOOGLE_CLOUD_LOCATION!,
    });

    const generativeModel = vertex_ai.getGenerativeModel({
      model: 'gemini-1.0-pro',
    });

    const caseData = await request.json();

    const prompt = `
      You are an expert Homeopathic Case Analyst Assistant. Your purpose is to help a qualified homeopath by suggesting relevant questions, potential keynotes, and repertory rubrics based on the provided case information.

      Analyze the following partial homeopathic case details:
      - Chief Complaint: "${caseData.chiefComplaint}"
      - Mind Symptoms: "${caseData.mind.anxiety}", "${caseData.mind.fears}"
      - General Symptoms: "${caseData.generals.thermal}", "${caseData.generals.thirst}"

      Based ONLY on the information provided, generate 3-5 concise and relevant suggestions. These suggestions can be of three types: 'question', 'keynote', or 'rubric'.

      You MUST respond with ONLY a valid JSON array of objects. Do not include any other text, explanation, or markdown formatting like \`\`\`json. Your entire response must be the JSON array itself.

      Example format:
      [{"type": "question", "suggestion": "Ask about...", "rationale": "Helps differentiate..."}]
    `;

    const resp = await generativeModel.generateContent(prompt);
    const contentResponse = await resp.response;
    const text = contentResponse.candidates[0].content.parts[0].text;
    
    if (!text) {
      throw new Error("Received an empty response from the AI.");
    }
    
    const suggestions = JSON.parse(text);
    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error("API Error in /api/ai/suggest:", error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while generating suggestions.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}