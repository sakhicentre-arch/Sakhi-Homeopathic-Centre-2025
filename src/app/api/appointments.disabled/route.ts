import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// --- GET Function ---
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: { name: true, phone: true },
        },
        clinic: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
      orderBy: {
        date: 'desc',
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

// --- POST Function ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received appointment data:', body); // Debug log
    
    const { patientName, patientPhone, appointmentTime, date, time, clinicId, patientId, notes } = body;

    // 1. Basic Field Validation
    const appointmentDate = appointmentTime || date;
    const appointmentTimeSlot = time || appointmentTime;
    
    if (!patientName && !patientId) {
      return NextResponse.json({ error: 'Patient information is required.' }, { status: 400 });
    }
    
    if (!appointmentDate) {
      return NextResponse.json({ error: 'Appointment date is required.' }, { status: 400 });
    }

    // 2. Handle patient - either find existing or create new
    let patient;
    
    if (patientId) {
      // Use existing patient
      patient = await prisma.patient.findUnique({
        where: { id: parseInt(patientId, 10) },
      });
      
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found.' }, { status: 404 });
      }
    } else if (patientName && patientPhone) {
      // Find or create patient by phone
      patient = await prisma.patient.findFirst({
        where: { phone: patientPhone },
      });
      
      if (!patient) {
        // Create new patient
        patient = await prisma.patient.create({
          data: {
            name: patientName,
            phone: patientPhone,
            clinicId: parseInt(clinicId, 10) || 1,
            userId: 1, // Default user
          },
        });
      }
    } else {
      return NextResponse.json({ error: 'Patient name and phone are required for new patients.' }, { status: 400 });
    }

    // 3. Date/Time Processing
    const appointmentDateTime = new Date(appointmentDate);
    const now = new Date();

    // Prevent booking in the past (with 5-minute grace period)
    if (appointmentDateTime < new Date(now.getTime() - 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Cannot book an appointment in the past.' }, { status: 400 });
    }

    // 4. Phone validation (if creating new patient)
    if (patientPhone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(patientPhone.replace(/\D/g, '').slice(-10))) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
      }
    }

    // 5. Create the appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        date: appointmentDateTime,
        time: appointmentTimeSlot || appointmentDateTime.toTimeString().slice(0, 5), // HH:MM format
        status: 'SCHEDULED',
        notes: notes || null,
        patientId: patient.id,
        clinicId: parseInt(clinicId, 10) || 1,
        userId: 1, // Default user (we'll improve this later)
      },
      include: {
        patient: {
          select: { name: true, phone: true },
        },
        clinic: {
          select: { name: true },
        },
      },
    });

    console.log('Appointment created successfully:', newAppointment); // Debug log
    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error('API Error in POST /api/appointments:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while creating the appointment.' },
      { status: 500 }
    );
  }
}
