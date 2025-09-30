import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
try {
await prisma.$queryRaw`SELECT 1`


const user = await prisma.user.findFirst().catch(() => null)
const patient = await prisma.patient.findFirst().catch(() => null)
const consultation = await prisma.consultation.findFirst().catch(() => null)

return NextResponse.json({
  ok: true,
  db: 'OK',
  models: {
    user: Boolean(user),
    patient: Boolean(patient),
    consultation: Boolean(consultation),
  },
})
} catch (e: any) {
return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
} finally {
await prisma.$disconnect()
}
}