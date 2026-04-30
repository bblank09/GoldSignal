import type { NextRequest } from 'next/server'

export function verifyCronSecret(request: NextRequest): boolean {
  const auth   = request.headers.get('authorization') ?? ''
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}
