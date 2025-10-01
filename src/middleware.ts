// TEMPORARILY DISABLED MIDDLEWARE FOR DEMO MODE
// This will be re-enabled in Phase 2 with proper authentication

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests for now - no authentication required
  return NextResponse.next()
}

export const config = {
  matcher: []
}
