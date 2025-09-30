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
    console.log('Received patient data:', body); // Debug log
    
    // Extract fields from form data
    const { name, phone, mobile, gender, age, notes } = body;
    
    // Use phone OR mobile (whichever the form sends)
    const phoneNumber = phone || mobile;
    
    // Map form gender values to database enum values
    const mapGender = (genderValue: string | null) => {
      if (!genderValue) return null;
      
      const genderLower = genderValue.toLowerCase();
      switch (genderLower) {
        case 'male':
        case 'm':
          return 'MALE';
        case 'female':
        case 'f':
          return 'FEMALE';
        case 'other':
        case 'o':
          return 'OTHER';
        default:
          return null;
      }
    };
    
    const phoneRegex = /^[0-9\s\-\+\(\)]*$/;
    const digitsOnly = (phoneNumber || '').replace(/\D/g, '');

    // --- SERVER-SIDE VALIDATION ---
    if (!name || !phoneNumber || !phoneRegex.test(phoneNumber) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      return new NextResponse(
        JSON.stringify({ message: 'Name and a valid phone number (10-15 digits) are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create patient with correct field mapping
    const patient = await prisma.patient.create({
      data: {
        name: name,
        phone: phoneNumber,
        gender: mapGender(gender), // Convert to proper enum value
        address: notes || null,
        clinicId: 1, // Default clinic ID
        userId: 1, // Default user ID (we'll improve this later)
      },
    });

    console.log('Patient created successfully:', patient); // Debug log
    return NextResponse.json(patient, { status: 201 });
    
  } catch (error) {
    console.error('API Error in POST /api/patients:', error);
    return new NextResponse('An unexpected error occurred.', { status: 500 });
  }
}
