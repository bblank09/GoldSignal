import { NextRequest, NextResponse } from 'next/server'
import { getUpcomingEvents, getSeedEvents } from '@/lib/services/calendar'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = Math.min(Number(searchParams.get('days') ?? '30'), 60)

  try {
    const events = await getUpcomingEvents(days)
    // If DB is empty, fall back to in-memory seed events
    if (events.length === 0) {
      return NextResponse.json(getSeedEvents())
    }
    return NextResponse.json(events)
  } catch {
    // DB unreachable — serve seed data so the tab always renders
    return NextResponse.json(getSeedEvents())
  }
}
