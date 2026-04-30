import { anthropic, MODEL, MAX_TOKENS, withRetry } from '@/lib/anthropic'
import { buildAnalyzePrompt } from '@/lib/prompts/analyze-article'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractJSON } from '@/lib/utils'
import type { Article, ArticleAnalysis, ImpactLevel, Sentiment, ImpactDirection, TimeHorizon } from '@/lib/types'

interface RawAnalysis {
  sentiment: Sentiment
  impact_score: number
  impact_level: ImpactLevel
  impact_direction: ImpactDirection
  time_horizon: TimeHorizon
  key_levels: { support: number[]; resistance: number[] }
  factors: string[]
  summary: string
  action_points: string
  bull_case: { price: number; description: string }
  base_case: { price: number; description: string }
  bear_case: { price: number; description: string }
  prob_bull: number
  z_score: string
  expected_move: string
  sources_cited: string[]
  confidence: number
}

async function analyzeArticle(article: Article, currentPrice: number): Promise<RawAnalysis> {
  const prompt = buildAnalyzePrompt(article, currentPrice)

  const message = await withRetry(() =>
    anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  )

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return extractJSON<RawAnalysis>(text)
}

// Called by cron — analyzes up to `limit` un-analyzed articles
export async function runAnalysisBatch(currentPrice: number, limit = 5): Promise<number> {
  const db = createAdminClient()

  // Fetch articles without analysis
  const { data: articles, error } = await db
    .from('articles')
    .select('*, article_analysis(article_id)')
    .is('article_analysis.article_id', null)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  if (!articles?.length) return 0

  let analyzed = 0
  for (const row of articles) {
    try {
      const article: Article = {
        id:           row.id as string,
        title:        row.title as string,
        source:       row.source as string,
        url:          row.url as string,
        published_at: row.published_at as string,
        category_id:  row.category_id as string,
        factors:      row.factors as string[],
        raw_excerpt:  row.raw_excerpt as string | null,
      }
      const raw = await analyzeArticle(article, currentPrice)
      const analysis: Omit<ArticleAnalysis, never> = {
        article_id:       article.id,
        sentiment:        raw.sentiment,
        impact_score:     raw.impact_score,
        impact_level:     raw.impact_level,
        impact_direction: raw.impact_direction,
        time_horizon:     raw.time_horizon,
        key_levels:       raw.key_levels,
        factors:          raw.factors,
        summary:          raw.summary,
        action_points:    raw.action_points,
        bull_case:        raw.bull_case,
        base_case:        raw.base_case,
        bear_case:        raw.bear_case,
        prob_bull:        raw.prob_bull,
        z_score:          raw.z_score,
        expected_move:    raw.expected_move,
        sources_cited:    raw.sources_cited,
        confidence:       raw.confidence,
        generated_at:     new Date().toISOString(),
        model:            MODEL,
      }
      await db.from('article_analysis').upsert(analysis)
      analyzed++
    } catch {
      // Log but don't stop the batch
    }
  }
  return analyzed
}
