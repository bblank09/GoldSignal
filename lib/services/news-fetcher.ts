import Parser from 'rss-parser'
import type { Article } from '@/lib/types'

const parser = new Parser()

interface RSSSource {
  url: string
  source: string
  category_id: string
  factors: string[]
}

const RSS_SOURCES: RSSSource[] = [
  { url: 'https://feeds.reuters.com/reuters/businessNews',          source: 'Reuters',         category_id: 'macro',  factors: ['Macro Data'] },
  { url: 'https://feeds.kitco.com/MarketNuggets',                   source: 'Kitco',           category_id: 'tech',   factors: ['Technical', 'Gold Market'] },
  { url: 'https://www.marketwatch.com/rss/topstories',              source: 'MarketWatch',     category_id: 'macro',  factors: ['US Markets'] },
  { url: 'https://finance.yahoo.com/rss/topfinstories',             source: 'Yahoo Finance',   category_id: 'macro',  factors: ['Markets'] },
  { url: 'https://www.investing.com/rss/news_25.rss',               source: 'Investing.com',   category_id: 'fed',    factors: ['Fed', 'Central Bank'] },
  { url: 'https://www.forexlive.com/feed/news',                     source: 'ForexLive',       category_id: 'dxy',    factors: ['USD', 'DXY', 'FX'] },
]

const GOLD_KEYWORDS = [
  'gold', 'xau', 'federal reserve', 'fed rate', 'inflation', 'cpi', 'pce',
  'dxy', 'dollar index', 'treasury', 'yield', 'safe haven', 'central bank',
  'pboc', 'bullion', 'precious metal', 'geopolit', 'rate cut', 'fomc',
]

function isGoldRelevant(text: string): boolean {
  const lower = text.toLowerCase()
  return GOLD_KEYWORDS.some((kw) => lower.includes(kw))
}

function detectCategory(text: string): string {
  const l = text.toLowerCase()
  if (l.includes('fed') || l.includes('fomc') || l.includes('central bank')) return 'fed'
  if (l.includes('dxy') || l.includes('dollar')) return 'dxy'
  if (l.includes('cpi') || l.includes('inflation') || l.includes('pce')) return 'infl'
  if (l.includes('geopolit') || l.includes('war') || l.includes('conflict')) return 'geo'
  if (l.includes('yield') || l.includes('treasury') || l.includes('bond')) return 'yield'
  if (l.includes('etf') || l.includes('flow')) return 'etf'
  if (l.includes('pboc') || l.includes('central bank') && l.includes('buy')) return 'cb'
  return 'macro'
}

function detectFactors(text: string): string[] {
  const l = text.toLowerCase()
  const factors: string[] = []
  if (l.includes('fed') || l.includes('fomc'))    factors.push('Fed Rate')
  if (l.includes('inflation') || l.includes('cpi')) factors.push('Inflation')
  if (l.includes('dxy') || l.includes('dollar'))   factors.push('DXY')
  if (l.includes('yield') || l.includes('treasury')) factors.push('US10Y')
  if (l.includes('geopolit'))                      factors.push('Geopolitical')
  if (l.includes('safe haven'))                    factors.push('Safe Haven')
  if (l.includes('etf'))                           factors.push('ETF Flow')
  if (l.includes('central bank') || l.includes('pboc')) factors.push('Central Bank')
  return factors.length > 0 ? factors : ['Gold Market']
}

export async function fetchNewsFromRSS(): Promise<Omit<Article, 'id'>[]> {
  const results: Omit<Article, 'id'>[] = []

  await Promise.allSettled(
    RSS_SOURCES.map(async (src) => {
      try {
        const feed = await parser.parseURL(src.url)
        for (const item of feed.items.slice(0, 20)) {
          const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
          if (!isGoldRelevant(text)) continue
          results.push({
            title:        item.title ?? 'Untitled',
            source:       src.source,
            url:          item.link ?? item.guid ?? '',
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            category_id:  detectCategory(text),
            factors:      detectFactors(text),
            raw_excerpt:  item.contentSnippet?.slice(0, 500) ?? null,
          })
        }
      } catch {
        // individual feed failures are non-fatal
      }
    }),
  )

  // Deduplicate by URL
  const seen = new Set<string>()
  return results.filter((a) => {
    if (!a.url || seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}
