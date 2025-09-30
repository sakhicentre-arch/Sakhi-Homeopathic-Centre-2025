import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// --- FIX: ADDED THE MISSING GET FUNCTION ---
// GET function to fetch visit history for a patient
export async function GET(request: NextRequest) {
  try {
    const patientIdString = request.nextUrl.searchParams.get('patientId');
    if (!patientIdString) {
      return new NextResponse('Patient ID is required', { status: 400 });
    }
    
    const patientId = Number(patientIdString);
    if (isNaN(patientId)) {
      return new NextResponse('Invalid Patient ID format', { status: 400 });
    }

    const visits = await prisma.visit.findMany({
      where: { patientId: patientId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Failed to fetch visits:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST function to create a new visit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, symptoms, diagnosis, fee, clinicId } = body;

    if (!patientId || !clinicId) {
      return new NextResponse('Patient ID and Clinic ID are required', { status: 400 });
    }

    const newVisit = await prisma.visit.create({
      data: {
        patientId: Number(patientId),
        clinicId: Number(clinicId),
        symptoms,
        diagnosis,
        fee: fee ? Number(fee) : 0,
      },
    });

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    console.error("Failed to create visit:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}