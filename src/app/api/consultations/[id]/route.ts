import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET a single consultation's details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const consultationId = Number(id);
    
    if (isNaN(consultationId)) {
      return new NextResponse('Invalid Consultation ID', { status: 400 });
    }

    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: { 
            id: true,
            name: true, 
            phone: true,
            gender: true,
            address: true 
          },
        },
        appointment: {
          select: { 
            id: true,
            date: true, 
            time: true,
            status: true 
          },
        },
        clinic: {
          select: { 
            id: true,
            name: true,
            address: true 
          },
        },
        user: {
          select: { 
            id: true,
            name: true 
          },
        },
        prescriptions: {
          select: {
            id: true,
            medicine: true,
            dosage: true,
            frequency: true,
            duration: true,
            instructions: true,
            createdAt: true,
          },
        },
      },
    });

    if (!consultation) {
      return new NextResponse('Consultation not found', { status: 404 });
    }

    return NextResponse.json(consultation);
  } catch (error) {
    console.error('GET /api/consultations/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// UPDATE a consultation's details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const consultationId = Number(id);
    
    if (isNaN(consultationId)) {
      return new NextResponse('Invalid Consultation ID', { status: 400 });
    }

    const body = await request.json();
    console.log('Updating consultation:', consultationId, body);
    
    const { 
      chiefComplaint, 
      symptoms, 
      diagnosis, 
      treatmentPlan,
      notes,
      followUpDate,
      prescriptions 
    } = body;

    // Update consultation and prescriptions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the consultation
      const updatedConsultation = await tx.consultation.update({
        where: { id: consultationId },
        data: {
          chiefComplaint: chiefComplaint || undefined,
          symptoms: symptoms || undefined,
          diagnosis: diagnosis || undefined,
          treatmentPlan: treatmentPlan || undefined,
          notes: notes || undefined,
          followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        },
      });

      // If prescriptions are provided, update them
      if (prescriptions && Array.isArray(prescriptions)) {
        // Delete existing prescriptions
        await tx.prescription.deleteMany({
          where: { consultationId: consultationId },
        });

        // Create new prescriptions
        if (prescriptions.length > 0) {
          await tx.prescription.createMany({
            data: prescriptions.map((prescription: any) => ({
              consultationId: consultationId,
              medicine: prescription.medicine,
              dosage: prescription.dosage,
              frequency: prescription.frequency,
              duration: prescription.duration,
              instructions: prescription.instructions || null,
            })),
          });
        }
      }

      return updatedConsultation;
    });

    // Fetch the updated consultation with all related data
    const completeConsultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: { name: true, phone: true },
        },
        prescriptions: true,
      },
    });

    return NextResponse.json(completeConsultation);
  } catch (error) {
    console.error('PATCH /api/consultations/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a consultation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const consultationId = Number(id);
    
    if (isNaN(consultationId)) {
      return new NextResponse('Invalid Consultation ID', { status: 400 });
    }

    // Delete consultation (cascade will remove prescriptions)
    await prisma.consultation.delete({
      where: { id: consultationId },
    });

    console.log('Consultation deleted:', consultationId);
    return new NextResponse(null, { status: 204 }); // Success, no content
  } catch (error) {
    console.error('DELETE /api/consultations/[id] Error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return new NextResponse('Consultation not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
