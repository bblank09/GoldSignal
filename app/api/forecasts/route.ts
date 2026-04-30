import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import { anthropic, MODEL, MAX_TOKENS, withRetry } from '@/lib/anthropic'
import { buildForecastsPrompt } from '@/lib/prompts/forecasts'
import { extractJSON } from '@/lib/utils'
import type { ArticleWithAnalysis, MacroSnapshot } from '@/lib/types'

interface Forecast {
  institution: string
  analyst: string | null
  target: number
  timeframe: string
  bias: 'Bullish' | 'Bearish' | 'Neutral'
  rationale: string
  source: string
  last_updated: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

export async function GET() {
  const db = createAdminClient()

  // Get current price
  let currentPrice = 4600
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/price`)
    if (res.ok) {
      const p = await res.json()
      currentPrice = p.price ?? currentPrice
    }
  } catch { /* use default */ }

  // Get macro data
  let macro: MacroSnapshot | null = null
  const { data: macroRow } = await db
    .from('macro_snapshots')
    .select('payload')
    .order('ts', { ascending: false })
    .limit(1)
    .single()
  if (macroRow?.payload) macro = macroRow.payload as MacroSnapshot

  // Get recent articles
  const { data: articles } = await db
    .from('articles')
    .select('*, article_analysis(*)')
    .order('published_at', { ascending: false })
    .limit(10)

  const analyzedArticles: ArticleWithAnalysis[] = (articles ?? [])
    .filter((r) => r.article_analysis)
    .map((r) => ({
      id:           r.id as string,
      title:        r.title as string,
      source:       r.source as string,
      url:          r.url as string,
      published_at: r.published_at as string,
      category_id:  r.category_id as string,
      factors:      r.factors as string[],
      raw_excerpt:  r.raw_excerpt as string | null,
      analysis:     r.article_analysis as ArticleWithAnalysis['analysis'],
    }))

  if (!macro) {
    return NextResponse.json({ error: 'No macro data available' }, { status: 503 })
  }

  const prompt = buildForecastsPrompt(analyzedArticles, macro, currentPrice)

  try {
    const message = await withRetry(() =>
      anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      })
    )

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const forecasts = extractJSON<Forecast[]>(text)

    return NextResponse.json(forecasts)
  } catch (err) {
    console.error('Forecasts generation error:', err)
    return NextResponse.json({ error: 'Failed to generate forecasts' }, { status: 500 })
  }
}
