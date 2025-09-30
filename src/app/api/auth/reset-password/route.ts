import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new NextResponse('Token and new password are required', { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return new NextResponse('Invalid or expired password reset token', { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return new NextResponse('Password has been reset successfully', { status: 200 });

  } catch (error) {
    console.error('API Error in POST /api/auth/reset-password:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while resetting password.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}