/**
 * Health check endpoint
 */

import { NextResponse } from 'next/server'
import { genAI } from '@/lib/gemini/config'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    gemini_ready: genAI !== null,
    model: 'gemini-2.0-flash-exp',
    version: '2.0.0',
    engine: 'Next.js + Google Gemini'
  })
}

export const dynamic = 'force-dynamic'

