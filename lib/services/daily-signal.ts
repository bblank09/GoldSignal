import { anthropic, MODEL, MAX_TOKENS, withRetry } from '@/lib/anthropic'
import { buildDailySynthesisPrompt } from '@/lib/prompts/daily-synthesis'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractJSON } from '@/lib/utils'
import type { ArticleWithAnalysis, MacroSnapshot, DailySignal, BiasDirection, ZoneLevel } from '@/lib/types'

interface RawSignal {
  bias: BiasDirection
  strength: number
  buy_zones: ZoneLevel[]
  sell_zones: ZoneLevel[]
  weekly_outlook: string
  supporting_factors: string[]
  risk_factors: string[]
  executive_summary: string
}

async function synthesizeSignal(
  articles: ArticleWithAnalysis[],
  macro: MacroSnapshot,
  currentPrice: number,
): Promise<RawSignal> {
  const prompt = buildDailySynthesisPrompt(articles, macro, currentPrice)

  const message = await withRetry(() =>
    anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  )

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return extractJSON<RawSignal>(text)
}

export async function runDailySignal(currentPrice: number): Promise<DailySignal> {
  const db = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Fetch today's articles with analysis
  const { data: rows, error: artErr } = await db
    .from('articles')
    .select('*, article_analysis(*)')
    .gte('published_at', `${today}T00:00:00Z`)
    .not('article_analysis', 'is', null)
    .order('published_at', { ascending: false })
    .limit(20)

  if (artErr) throw artErr

  const articles: ArticleWithAnalysis[] = (rows ?? [])
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

  // Fetch latest macro snapshot
  const { data: macroRow, error: macErr } = await db
    .from('macro_snapshots')
    .select('*')
    .order('ts', { ascending: false })
    .limit(1)
    .single()

  if (macErr && macErr.code !== 'PGRST116') throw macErr
  
  const macro = macroRow?.payload as MacroSnapshot || {
    dxy: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    us10y: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    us2y: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    vix: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    sp500: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    oil_wti: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
    ts: new Date().toISOString()
  }

  const raw = await synthesizeSignal(articles, macro, currentPrice)

  const signal: DailySignal = {
    date:                today,
    bias:                raw.bias,
    strength:            raw.strength as DailySignal['strength'],
    buy_zones:           raw.buy_zones,
    sell_zones:          raw.sell_zones,
    weekly_outlook:      raw.weekly_outlook,
    supporting_factors:  raw.supporting_factors,
    risk_factors:        raw.risk_factors,
    executive_summary:   raw.executive_summary,
    generated_at:        new Date().toISOString(),
  }

  const { data: upserted, error: sigErr } = await db
    .from('daily_signals')
    .upsert({ ...signal }, { onConflict: 'date' })
    .select()
    .single()

  if (sigErr) throw sigErr
  return upserted as DailySignal
}
