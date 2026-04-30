import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { redis, MACRO_KEY } from '@/lib/redis'
import { createAdminClient } from '@/lib/supabase/admin'
import type { MacroSnapshot } from '@/lib/types'

export async function GET() {
  const cached = await redis.get<string>(MACRO_KEY)
  if (cached) {
    const macro: MacroSnapshot = typeof cached === 'string' ? JSON.parse(cached) : cached
    return NextResponse.json(macro)
  }

  const db = createAdminClient()
  const { data, error } = await db
    .from('macro_snapshots')
    .select('payload')
    .order('ts', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No macro data' }, { status: 503 })
  }

  return NextResponse.json(data.payload as MacroSnapshot)
}
