import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { isMockMode } from '@/lib/mock-mode'
import { getUpcomingEvents, getSeedEvents } from '@/lib/services/calendar'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = Math.min(Number(searchParams.get('days') ?? '30'), 60)

  // ── Mock mode (default) — always return seed events ───────────────────────
  if (isMockMode()) {
    return NextResponse.json(getSeedEvents())
  }

  // ── Live mode ─────────────────────────────────────────────────────────────
  try {
    const events = await getUpcomingEvents(days)
    if (events.length === 0) return NextResponse.json(getSeedEvents())
    return NextResponse.json(events)
  } catch {
    return NextResponse.json(getSeedEvents())
  }
}
