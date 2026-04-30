import { NextResponse } from 'next/server'
import { redis, MACRO_KEY, MACRO_TTL } from '@/lib/redis'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchMacroSnapshot } from '@/lib/services/macro'
import type { MacroSnapshot } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  // 1. Try Redis cache
  try {
    const cached = await redis.get<string>(MACRO_KEY)
    if (cached) {
      const macro: MacroSnapshot = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(macro)
    }
  } catch { /* Redis unavailable */ }

  // 2. Try Supabase DB
  try {
    const db = createAdminClient()
    const { data } = await db
      .from('macro_snapshots')
      .select('snapshot')
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single()

    if (data?.snapshot) {
      const macro = data.snapshot as MacroSnapshot
      // Backfill Redis so next request is cached
      await redis.set(MACRO_KEY, JSON.stringify(macro), { ex: MACRO_TTL }).catch(() => {})
      return NextResponse.json(macro)
    }
  } catch { /* DB unavailable or empty */ }

  // 3. Live fetch from Yahoo Finance (fallback — no cron needed)
  try {
    const macro = await fetchMacroSnapshot()
    // Cache so subsequent requests are fast
    await redis.set(MACRO_KEY, JSON.stringify(macro), { ex: MACRO_TTL }).catch(() => {})
    return NextResponse.json(macro)
  } catch (err) {
    return NextResponse.json(
      { error: 'Macro data unavailable', detail: String(err) },
      { status: 503 },
    )
  }
}
