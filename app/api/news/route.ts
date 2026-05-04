import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { isMockMode } from '@/lib/mock-mode'
import { mockArticlesWithAnalysis } from '@/lib/mock-data'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ArticleWithAnalysis } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const limit    = Math.min(Number(searchParams.get('limit') ?? '50'), 100)

  // ── Mock mode (default) ──────────────────────────────────────────────────────
  if (isMockMode()) {
    let articles = mockArticlesWithAnalysis
    if (category) articles = articles.filter((a) => a.category_id === category)
    return NextResponse.json(articles.slice(0, limit))
  }

  // ── Live mode ────────────────────────────────────────────────────────────────
  const db = createAdminClient()
  let query = db
    .from('articles')
    .select('*, article_analysis(*)')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category_id', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const articles: ArticleWithAnalysis[] = (data ?? [])
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

  return NextResponse.json(articles)
}
