import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getUpcomingEvents } from '@/lib/services/calendar'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = Math.min(Number(searchParams.get('days') ?? '7'), 30)

  const events = await getUpcomingEvents(days)
  return NextResponse.json(events)
}
