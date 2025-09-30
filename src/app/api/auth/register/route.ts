import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Use the shared prisma client
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return new NextResponse('Email and password are required', { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return new NextResponse('User with this email already exists', { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'ADMIN' },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/auth/register:', error);
    return new NextResponse('An unexpected error occurred during registration.', { status: 500 });
  }
}