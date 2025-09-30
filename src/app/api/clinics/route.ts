import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({ 
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: {
            patients: true,
            appointments: true,
            consultations: true,
          },
        },
      },
    });
    return NextResponse.json(clinics);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Clinic name is required' },
        { status: 400 }
      );
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: name.trim(),
        address: address?.trim() || null,
      },
    });

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error('Error creating clinic:', error);
    return NextResponse.json(
      { error: 'Failed to create clinic' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, address } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json(
        { error: 'Clinic ID and name are required' },
        { status: 400 }
      );
    }

    const clinic = await prisma.clinic.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: name.trim(),
        address: address?.trim() || null,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.error('Error updating clinic:', error);
    return NextResponse.json(
      { error: 'Failed to update clinic' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    // Check if clinic has associated records
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        _count: {
          select: {
            patients: true,
            appointments: true,
            consultations: true,
          },
        },
      },
    });

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if clinic has associated records
    if (clinic._count.patients > 0 || clinic._count.appointments > 0 || clinic._count.consultations > 0) {
      return NextResponse.json(
        { error: 'Cannot delete clinic with existing patients, appointments, or consultations' },
        { status: 400 }
      );
    }

    await prisma.clinic.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return NextResponse.json(
      { error: 'Failed to delete clinic' },
      { status: 500 }
    );
  }
}
