import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword } = await req.json()
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }
    
    // For now, just return success (skip database)
    return NextResponse.json({ 
      message: 'Registration successful!',
      user: { email }
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
