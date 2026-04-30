import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/auth'
import { fetchMacroSnapshot } from '@/lib/services/macro'
import { redis, MACRO_KEY, MACRO_TTL } from '@/lib/redis'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const macro = await fetchMacroSnapshot()
  const db = createAdminClient()

  const { error } = await db.from('macro_snapshots').insert({
    payload: macro,
    ts:      macro.ts,
  })

  if (error) {
    console.error('Supabase macro insert error:', error)
  }

  await redis.set(MACRO_KEY, JSON.stringify(macro), { ex: MACRO_TTL })

  return NextResponse.json({ ok: true })
}
