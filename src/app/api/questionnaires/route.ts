import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      email, 
      dob, 
      gender, 
      address, 
      chiefComplaint, 
      historyOfPresentIllness 
    } = body;

    if (!name || !phone || !chiefComplaint) {
      return new NextResponse('Name, phone, and chief complaint are required', { status: 400 });
    }

    const newQuestionnaire = await prisma.patientQuestionnaire.create({
      data: {
        name,
        phone,
        email,
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        chiefComplaint,
        historyOfPresentIllness,
      },
    });

    return NextResponse.json(newQuestionnaire, { status: 201 });

  } catch (error) {
    console.error("API Error in POST /api/questionnaires:", error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while submitting the questionnaire.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}