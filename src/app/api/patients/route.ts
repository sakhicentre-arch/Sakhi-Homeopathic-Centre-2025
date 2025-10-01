import { NextRequest, NextResponse } from 'next/server'

// TEMPORARY PATIENT API BYPASS - Phase 1 Demo Mode
// This file bypasses database operations for testing UI functionality
// Will be replaced with full database integration in Phase 2

// Mock patient data for demonstration
let mockPatients = [
  {
    id: 1,
    name: "Demo Patient",
    phone: "9876543210",
    gender: "Male",
    age: 35,
    notes: "Sample patient for demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// GET /api/patients - Fetch all patients
export async function GET(request: NextRequest) {
  try {
    // Return mock patients for demo
    return NextResponse.json(mockPatients, { status: 200 })
  } catch (error) {
    console.error('API Error in GET /api/patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' }, 
      { status: 500 }
    )
  }
}

// POST /api/patients - Create new patient
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, gender, age, notes } = body

    // Server-side validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Patient name is required' }, 
        { status: 400 }
      )
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' }, 
        { status: 400 }
      )
    }

    // Phone validation
    const phoneRegex = /^[0-9\-\s\+\(\)]+$/
    const digitsOnly = phone.replace(/\D/g, '')
    
    if (!phoneRegex.test(phone) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (10-15 digits)' }, 
        { status: 400 }
      )
    }

    // Age validation
    if (age && (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 150)) {
      return NextResponse.json(
        { error: 'Please enter a valid age (0-150)' }, 
        { status: 400 }
      )
    }

    // Create new patient with mock data
    const newPatient = {
      id: mockPatients.length + 1,
      name: name.trim(),
      phone: phone.trim(),
      gender: gender || null,
      age: age ? Number(age) : null,
      notes: notes?.trim() || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to mock patients array
    mockPatients.push(newPatient)

    console.log('✅ Patient created successfully (Demo Mode):', newPatient)

    return NextResponse.json(
      { 
        message: 'Patient created successfully!',
        patient: newPatient 
      }, 
      { status: 201 }
    )

  } catch (error) {
    console.error('API Error in POST /api/patients:', error)
    return NextResponse.json(
      { error: 'Failed to create patient. Please try again.' }, 
      { status: 500 }
    )
  }
}

// PUT /api/patients/:id - Update patient (for future use)
export async function PUT(request: Request) {
  try {
    return NextResponse.json(
      { message: 'Patient update feature available in Phase 2' }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('API Error in PUT /api/patients:', error)
    return NextResponse.json(
      { error: 'Update failed' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/patients/:id - Delete patient (for future use)
export async function DELETE(request: Request) {
  try {
    return NextResponse.json(
      { message: 'Patient deletion feature available in Phase 2' }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('API Error in DELETE /api/patients:', error)
    return NextResponse.json(
      { error: 'Delete failed' }, 
      { status: 500 }
    )
  }
}
