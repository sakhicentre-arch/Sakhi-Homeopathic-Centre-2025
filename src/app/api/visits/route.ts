import { NextResponse } from 'next/server';
import { PrismaClient, VisitStatus } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
const today = new Date();
today.setHours(0,0,0,0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const visits = await prisma.visit.findMany({
where: { date: { gte: today, lt: tomorrow } },
include: { patient: true, clinic: true },
orderBy: { id: 'desc' },
});
return NextResponse.json(visits);
}

export async function POST(req: Request) {
const b = await req.json();
const visit = await prisma.visit.create({
data: {
date: new Date(),
clinicId: Number(b.clinicId),
patientId: Number(b.patientId),
status: VisitStatus.SCHEDULED,
symptoms: b.symptoms ?? null,
diagnosis: b.diagnosis ?? null,
fee: b.fee ? Number(b.fee) : 0,
paymentMode: b.paymentMode ?? 'NONE',
paid: !!b.paid,
},
});
return NextResponse.json(visit, { status: 201 });
}

export async function PATCH(req: Request) {
const { id, status } = await req.json();
const visit = await prisma.visit.update({
where: { id: Number(id) },
data: { status },
});
return NextResponse.json(visit);
}