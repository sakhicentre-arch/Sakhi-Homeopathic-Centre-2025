import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // For security reasons, do not reveal if the email exists or not
      return new NextResponse('If an account with that email exists, a password reset link has been sent.', { status: 200 });
    }

    // Generate a unique token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // In a real application, you would send an email here.
    // For now, we'll log the token to the console.
    console.log(`Password Reset Token for ${email}: ${resetToken}`);

    return new NextResponse('If an account with that email exists, a password reset link has been sent.', { status: 200 });

  } catch (error) {
    console.error('API Error in POST /api/auth/forgot-password:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An unexpected error occurred while processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}