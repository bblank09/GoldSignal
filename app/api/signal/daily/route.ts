import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import type { DailySignal } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const db = createAdminClient()
  const { data, error } = await db
    .from('daily_signals')
    .select('*')
    .eq('date', date)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No signal for date' }, { status: 404 })
  }

  return NextResponse.json(data as DailySignal)
}
