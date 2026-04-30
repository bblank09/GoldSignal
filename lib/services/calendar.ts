import type { EconomicEvent } from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'

// Seeded calendar — covers current week through end of May 2026
const SEED_EVENTS: Omit<EconomicEvent, 'id'>[] = [
  // ── This week (Apr 30 – May 2) ────────────────────────────────────────────────
  { date: 'Wed Apr 30', iso_date: '2026-04-30T12:30:00Z', event: 'US GDP Advance Q1',      country: 'US', importance: 'HIGH',   forecast: '0.4%',  previous: '2.4%',  actual: null, gold_impact: 'Weak GDP = recession fears = safe haven gold bid' },
  { date: 'Wed Apr 30', iso_date: '2026-04-30T14:00:00Z', event: 'FOMC Rate Decision',     country: 'US', importance: 'HIGH',   forecast: '4.25%', previous: '4.25%', actual: null, gold_impact: 'Hold + dovish statement = bullish; hawkish = bearish' },
  { date: 'Wed Apr 30', iso_date: '2026-04-30T18:30:00Z', event: 'Powell Press Conference', country: 'US', importance: 'HIGH',   forecast: 'N/A',   previous: 'N/A',   actual: null, gold_impact: 'Dovish pivot signal = +$40–$60' },
  { date: 'Thu May 1',  iso_date: '2026-05-01T12:30:00Z', event: 'US Initial Jobless Claims',country: 'US', importance: 'MEDIUM', forecast: '222K',  previous: '215K',  actual: null, gold_impact: 'High claims = labor weakness = Fed cut closer = bullish' },
  { date: 'Fri May 2',  iso_date: '2026-05-02T12:30:00Z', event: 'Non-Farm Payrolls (Apr)', country: 'US', importance: 'HIGH',   forecast: '135K',  previous: '228K',  actual: null, gold_impact: 'Weak NFP = Fed cut closer = bullish for gold' },
  { date: 'Fri May 2',  iso_date: '2026-05-02T12:30:00Z', event: 'US Unemployment Rate',   country: 'US', importance: 'HIGH',   forecast: '4.3%',  previous: '4.2%',  actual: null, gold_impact: 'Rising unemployment = Fed cut sooner = gold positive' },

  // ── Week of May 5 ─────────────────────────────────────────────────────────────
  { date: 'Tue May 6',  iso_date: '2026-05-06T14:00:00Z', event: 'US ISM Services PMI',    country: 'US', importance: 'MEDIUM', forecast: '51.2',  previous: '50.8',  actual: null, gold_impact: 'Below 50 = contraction = safe haven bid' },
  { date: 'Thu May 8',  iso_date: '2026-05-08T11:00:00Z', event: 'ECB Rate Decision',       country: 'EU', importance: 'MEDIUM', forecast: '2.40%', previous: '2.65%', actual: null, gold_impact: 'ECB cut weakens EUR → DXY up → mild gold headwind' },

  // ── Week of May 12 ────────────────────────────────────────────────────────────
  { date: 'Wed May 14', iso_date: '2026-05-14T12:30:00Z', event: 'US CPI (Apr)',            country: 'US', importance: 'HIGH',   forecast: '3.4%',  previous: '3.5%',  actual: null, gold_impact: 'Below forecast = bullish gold; above = bearish' },
  { date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US PPI (Apr)',             country: 'US', importance: 'HIGH',   forecast: '0.3%',  previous: '0.2%',  actual: null, gold_impact: 'Soft PPI = bullish via Fed cut odds' },
  { date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US Retail Sales (Apr)',   country: 'US', importance: 'MEDIUM', forecast: '-0.1%', previous: '-0.3%', actual: null, gold_impact: 'Weak = bullish via USD weakness' },
  { date: 'Fri May 16', iso_date: '2026-05-16T14:00:00Z', event: 'US Consumer Sentiment',   country: 'US', importance: 'MEDIUM', forecast: '76.2',  previous: '77.2',  actual: null, gold_impact: 'Low sentiment = mild safe haven bid' },

  // ── Week of May 19 ────────────────────────────────────────────────────────────
  { date: 'Wed May 21', iso_date: '2026-05-21T18:00:00Z', event: 'FOMC Meeting Minutes',    country: 'US', importance: 'HIGH',   forecast: 'N/A',   previous: 'N/A',   actual: null, gold_impact: 'Dovish tone = strongly bullish' },
  { date: 'Thu May 22', iso_date: '2026-05-22T12:30:00Z', event: 'US Initial Jobless Claims',country: 'US', importance: 'MEDIUM', forecast: '218K',  previous: '222K',  actual: null, gold_impact: 'High claims = labor weakness = bullish' },
  { date: 'Fri May 23', iso_date: '2026-05-23T12:30:00Z', event: 'US PCE Deflator (Apr)',   country: 'US', importance: 'HIGH',   forecast: '2.7%',  previous: '2.7%',  actual: null, gold_impact: 'Below 2.7% = bullish for rate cut timing' },

  // ── Week of May 26 ────────────────────────────────────────────────────────────
  { date: 'Tue May 27', iso_date: '2026-05-27T14:00:00Z', event: 'US Consumer Confidence',  country: 'US', importance: 'MEDIUM', forecast: '98.0',  previous: '97.2',  actual: null, gold_impact: 'Low confidence = safe haven bid = mild bullish' },
  { date: 'Thu May 29', iso_date: '2026-05-29T12:30:00Z', event: 'US GDP Q1 Final',         country: 'US', importance: 'MEDIUM', forecast: '0.4%',  previous: '2.4%',  actual: null, gold_impact: 'Weak GDP confirms slowdown = Fed cut nearer = bullish' },
  { date: 'Fri May 30', iso_date: '2026-05-30T12:30:00Z', event: 'US Core PCE (Apr)',       country: 'US', importance: 'HIGH',   forecast: '2.5%',  previous: '2.6%',  actual: null, gold_impact: 'Below 2.5% = bullish acceleration; above = bearish' },
]

export async function syncCalendar(): Promise<number> {
  const db = createAdminClient()
  let inserted = 0
  for (const ev of SEED_EVENTS) {
    const { error } = await db
      .from('economic_events')
      .upsert(
        { ...ev, date_label: ev.date },
        { onConflict: 'iso_date,event', ignoreDuplicates: true },
      )
    if (!error) inserted++
  }
  return inserted
}

export async function getUpcomingEvents(days = 30): Promise<EconomicEvent[]> {
  const db = createAdminClient()
  const from = new Date().toISOString()
  const to   = new Date(Date.now() + days * 86_400_000).toISOString()

  const { data, error } = await db
    .from('economic_events')
    .select('*')
    .gte('iso_date', from)
    .lte('iso_date', to)
    .order('iso_date', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id:          r.id as string,
    date:        r.date_label as string,
    iso_date:    r.iso_date as string,
    event:       r.event as string,
    country:     r.country as string,
    importance:  r.importance as EconomicEvent['importance'],
    forecast:    r.forecast as string,
    previous:    r.previous as string,
    actual:      r.actual as string | null,
    gold_impact: r.gold_impact as string,
  }))
}

// In-memory fallback — returns seed events without needing Supabase
// Used when DB is empty / unreachable during first run
export function getSeedEvents(): EconomicEvent[] {
  return SEED_EVENTS.map((ev, i) => ({ ...ev, id: `seed-${i}` }))
}
