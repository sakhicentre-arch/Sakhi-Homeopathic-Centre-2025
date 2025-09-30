import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// --- GET Function (No changes needed here) ---
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        clinic: {
          select: { name: true },
        },
      },
      orderBy: {
        appointmentTime: 'desc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('API Error in GET /api/appointments:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while fetching appointments.' },
      { status: 500 }
    );
  }
}

// --- POST Function (Upgraded with Validation) ---
export async function POST(req: Request) {
  try {
    const { patientName, patientPhone, appointmentTime, clinicId } = await req.json();

    // 1. Basic Field Validation
    if (!patientName || !patientPhone || !appointmentTime || !clinicId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const appointmentDate = new Date(appointmentTime);
    const now = new Date();

    // 2. Prevent Booking in the Past (with a 5-minute grace period)
    if (appointmentDate < new Date(now.getTime() - 5 * 60 * 1000)) {
        return NextResponse.json({ error: 'Cannot book an appointment in the past.' }, { status: 400 });
    }

    // 3. Indian Phone Number Validation (simple regex for 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(patientPhone)) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    // 4. Validate appointment time against clinic operating hours
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId, 10) },
      select: { startHour: true, endHour: true },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found.' }, { status: 404 });
    }

    const appointmentHour = appointmentDate.getHours();
    if (appointmentHour < clinic.startHour || appointmentHour >= clinic.endHour) {
      return NextResponse.json({ error: `Appointments can only be booked between ${clinic.startHour}:00 and ${clinic.endHour}:00.` }, { status: 400 });
    }

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/appointments:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while creating the appointment.' },
      { status: 500 }
    );
  }
}
