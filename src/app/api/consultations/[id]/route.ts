import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET a single visit's details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const visitId = Number(id);
    if (isNaN(visitId)) {
      return new NextResponse('Invalid Visit ID', { status: 400 });
    }

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      return new NextResponse('Visit not found', { status: 404 });
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error('GET /api/consultations/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// UPDATE a visit's details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const visitId = Number(id);
    if (isNaN(visitId)) {
      return new NextResponse('Invalid Visit ID', { status: 400 });
    }
    
    const body = await request.json();
    const { symptoms, diagnosis, fee } = body;

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        symptoms,
        diagnosis,
        fee: fee ? Number(fee) : undefined,
      },
    });
    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error('PATCH /api/consultations/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a visit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const visitId = Number(id);
    if (isNaN(visitId)) {
      return new NextResponse('Invalid Visit ID', { status: 400 });
    }

    // Prisma Cascade delete will also remove related prescription items
    await prisma.visit.delete({
      where: { id: visitId },
    });

    return new NextResponse(null, { status: 204 }); // Success, no content
  } catch (error) {
    console.error('DELETE /api/consultations/[id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}