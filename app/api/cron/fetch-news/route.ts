import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/auth'
import { fetchNewsFromRSS } from '@/lib/services/news-fetcher'
import { runAnalysisBatch } from '@/lib/services/news-analyzer'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const articles = await fetchNewsFromRSS()
  const db = createAdminClient()

  let inserted = 0
  for (const article of articles) {
    const { error } = await db.from('articles').upsert(
      {
        title:        article.title,
        source:       article.source,
        url:          article.url,
        published_at: article.published_at,
        category_id:  article.category_id,
        factors:      article.factors,
        raw_excerpt:  article.raw_excerpt,
      },
      { onConflict: 'url', ignoreDuplicates: true },
    )
    if (error) {
      console.error(`Supabase article insert error for ${article.url}:`, error)
    } else {
      inserted++
    }
  }

  // Auto-analyze new articles (up to 10 per run)
  let analyzed = 0
  if (inserted > 0) {
    try {
      // Get current gold price for analysis context
      let currentPrice = 4600
      try {
        const priceRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/price`)
        if (priceRes.ok) {
          const p = await priceRes.json()
          currentPrice = p.price ?? currentPrice
        }
      } catch { /* use default */ }

      analyzed = await runAnalysisBatch(currentPrice, Math.min(inserted, 10))
    } catch (err) {
      console.error('Auto-analyze error:', err)
    }
  }

  return NextResponse.json({ ok: true, inserted, analyzed, total: articles.length })
}
