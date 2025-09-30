import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET a single remedy
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return new NextResponse('Invalid ID', { status: 400 });
    
    const remedy = await prisma.remedy.findUnique({ where: { id } });
    if (!remedy) return new NextResponse('Remedy not found', { status: 404 });
    
    return NextResponse.json(remedy);
  } catch (error) {
    console.error(`GET /api/remedies/${params.id} Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// UPDATE a remedy
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return new NextResponse('Invalid ID', { status: 400 });

    const body = await req.json();
    const { name, abbreviation, commonName } = body;

    // --- IMPROVEMENT: Add validation for required fields ---
    if (!name || name.trim() === '') {
      return new NextResponse('Remedy name cannot be empty.', { status: 400 });
    }

    const updatedRemedy = await prisma.remedy.update({
      where: { id },
      data: { name, abbreviation, commonName },
    });
    return NextResponse.json(updatedRemedy);
  } catch (error: any) {
    // --- IMPROVEMENT: Add specific error for duplicate names ---
    if (error.code === 'P2002') {
      return new NextResponse('A remedy with this name already exists.', { status: 409 });
    }
    console.error(`PATCH /api/remedies/${params.id} Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a remedy
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return new NextResponse('Invalid ID', { status: 400 });

    await prisma.remedy.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/remedies/${params.id} Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}