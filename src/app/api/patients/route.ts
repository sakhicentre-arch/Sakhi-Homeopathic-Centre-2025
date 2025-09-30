import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('API Error in GET /api/patients:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/patients
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, gender, age, notes } = body;
    
    const phoneRegex = /^[0-9\s\-\+\(\)]*$/;
    const digitsOnly = (phone || '').replace(/\D/g, '');

    // --- SERVER-SIDE VALIDATION ---
    if (!name || !phone || !phoneRegex.test(phone) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      return new NextResponse(
        JSON.stringify({ message: 'Name and a valid phone number (10-15 digits) are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const patient = await prisma.patient.create({
      data: { name, mobile: phone, gender, age: age ? Number(age) : null, notes },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/patients:', error);
    return new NextResponse('An unexpected error occurred.', { status: 500 });
  }
}