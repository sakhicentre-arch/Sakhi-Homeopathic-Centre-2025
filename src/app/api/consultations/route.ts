import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const patientIdString = request.nextUrl.searchParams.get('patientId');
    
    let consultations;
    
    if (patientIdString) {
      const patientId = Number(patientIdString);
      if (isNaN(patientId)) {
        return new NextResponse('Invalid Patient ID format', { status: 400 });
      }
      
      consultations = await prisma.consultation.findMany({
        where: { patientId: patientId },
        include: {
          patient: { select: { name: true, phone: true } },
          appointment: { select: { date: true, time: true } },
          clinic: { select: { name: true } },
          prescriptions: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      consultations = await prisma.consultation.findMany({
        include: {
          patient: { select: { name: true, phone: true } },
          appointment: { select: { date: true, time: true } },
          clinic: { select: { name: true } },
          prescriptions: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Failed to fetch consultations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received consultation data:', body);
    
    const {
      appointmentId,
      chiefComplaint,
      symptoms,
      diagnosis,
      treatmentPlan,
      notes,
      followUpDate,
      prescriptions = []
    } = body;

    if (!appointmentId || !chiefComplaint) {
      return NextResponse.json(
        { error: 'Appointment ID and Chief Complaint are required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
      include: { patient: true }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.create({
        data: {
          appointmentId: Number(appointmentId),
          patientId: appointment.patient.id,
          clinicId: appointment.clinicId,
          userId: appointment.userId,
          chiefComplaint,
          symptoms: symptoms || null,
          diagnosis: diagnosis || null,
          treatmentPlan: treatmentPlan || null,
          notes: notes || null,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
        },
      });

      if (prescriptions && prescriptions.length > 0) {
        await tx.prescription.createMany({
          data: prescriptions.map((prescription: any) => ({
            consultationId: consultation.id,
            medicine: prescription.medicine,
            dosage: prescription.dosage,
            frequency: prescription.frequency,
            duration: prescription.duration,
            instructions: prescription.instructions || null,
          })),
        });
      }

      await tx.appointment.update({
        where: { id: Number(appointmentId) },
        data: { status: 'COMPLETED' },
      });

      return consultation;
    });

    const completeConsultation = await prisma.consultation.findUnique({
      where: { id: result.id },
      include: {
        patient: { select: { name: true, phone: true } },
        appointment: { select: { date: true, time: true } },
        prescriptions: true,
      },
    });

    console.log('Consultation created successfully:', completeConsultation);
    return NextResponse.json(completeConsultation, { status: 201 });

  } catch (error) {
    console.error('Failed to create consultation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
