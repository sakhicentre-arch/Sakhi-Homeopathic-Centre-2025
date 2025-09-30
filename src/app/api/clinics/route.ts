import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
const clinics = await prisma.clinic.findMany({ orderBy: { id: 'asc' } });
return NextResponse.json(clinics);
}