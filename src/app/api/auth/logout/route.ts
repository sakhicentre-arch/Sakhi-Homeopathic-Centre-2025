import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  
  // Clear session cookie
  response.cookies.set('sakhi-session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0
  })
  
  return response
}
