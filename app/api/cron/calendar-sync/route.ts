import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/auth'
import { syncCalendar } from '@/lib/services/calendar'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const inserted = await syncCalendar()
  return NextResponse.json({ ok: true, inserted })
}
