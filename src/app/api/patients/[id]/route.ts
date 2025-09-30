import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET a single patient's details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = Number(id);
    if (isNaN(patientId)) return new NextResponse('Invalid Patient ID', { status: 400 });
    
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) return new NextResponse('Patient not found', { status: 404 });
    
    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patients/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// UPDATE a patient's details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = Number(id);
    if (isNaN(patientId)) return new NextResponse('Invalid Patient ID', { status: 400 });
    
    const body = await request.json();
    const { name, phone, gender } = body;
    
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { name, mobile: phone, gender },
    });
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('PATCH /api/patients/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a patient
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = Number(id);
    if (isNaN(patientId)) return new NextResponse('Invalid Patient ID', { status: 400 });
    
    await prisma.patient.delete({ where: { id: patientId } });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/patients/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
