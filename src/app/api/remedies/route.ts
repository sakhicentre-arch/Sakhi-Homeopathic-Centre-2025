import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// This API fetches all remedies from your master list to populate the dropdown.
export async function GET() {
  try {
    const remedies = await prisma.remedy.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(remedies);
  } catch (error) {
    console.error("Failed to fetch remedies:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}