import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET prescriptions for a specific visit
export async function GET(request: NextRequest) {
  try {
    const visitIdString = request.nextUrl.searchParams.get('visitId');
    if (!visitIdString) {
      return new NextResponse('Visit ID is required', { status: 400 });
    }
    const visitId = Number(visitIdString);
    if (isNaN(visitId)) {
      return new NextResponse('Invalid Visit ID', { status: 400 });
    }

    const items = await prisma.prescriptionItem.findMany({
      where: { visitId },
      include: { remedy: true }, // Also fetch the remedy name
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch prescription:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new prescription for a visit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitId, notes, remedies } = body;

    if (!visitId || !remedies || !Array.isArray(remedies)) {
      return new NextResponse('Visit ID and remedies are required.', { status: 400 });
    }
    
    // First, delete any existing prescription items for this visit.
    // This makes the "Save" button work for both creating a new prescription
    // and updating an existing one.
    await prisma.prescriptionItem.deleteMany({
      where: { visitId: Number(visitId) },
    });

    // If the user cleared all remedies, we are done.
    if (remedies.length === 0) {
        return NextResponse.json({ message: 'Prescription cleared successfully.' }, { status: 200 });
    }

    // Otherwise, create the new items in a single transaction.
    const createdItems = await prisma.prescriptionItem.createMany({
      data: remedies.map((remedy: any) => ({
        visitId: Number(visitId),
        remedyId: Number(remedy.remedyId),
        potency: remedy.potency,
        dose: remedy.dosage,
        notes: notes,
      })),
    });

    return NextResponse.json(createdItems, { status: 201 });
  } catch (error) {
    console.error("Failed to create prescription:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}