import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 Login attempt:', email)

    // Validate credentials
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Hard-coded demo credentials
    const validUsers = [
      { email: 'sakhicentre@gmail.com', password: 'password123', name: 'Dr. Admin', role: 'ADMIN' },
      { email: 'test@test.com', password: '123456', name: 'Test User', role: 'USER' }
    ]

    const user = validUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create user session data
    const sessionData = {
      id: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString()
    }

    // Set session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: sessionData
    }, { status: 200 })

    // Set HTTP-only cookie for session
    response.cookies.set('sakhi-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    console.log('✅ Login successful for:', email)
    return response

  } catch (error) {
    console.error('🚨 Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
