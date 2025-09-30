import { NextRequest, NextResponse } from 'next/server';
import rubrics from '@/lib/rubrics.json'; // Import our data using the '@/' alias

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // If there's no search query, return an empty list
    if (!query) {
      return NextResponse.json([]);
    }

    const lowerCaseQuery = query.toLowerCase();

    // Filter the rubrics to find matches
    const filteredRubrics = rubrics.filter(rubric =>
      rubric.toLowerCase().includes(lowerCaseQuery)
    );

    // Limit the results to a reasonable number (e.g., the top 10)
    const results = filteredRubrics.slice(0, 10);

    return NextResponse.json(results);

  } catch (error) {
    console.error("API Error in GET /api/rubics:", error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while searching rubrics.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}