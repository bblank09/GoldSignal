import type { Article } from '@/lib/types'

export function buildAnalyzePrompt(article: Article, currentPrice: number): string {
  return `You are a professional gold market analyst. Analyze the following news article and return a JSON object that precisely describes its impact on XAU/USD.

CURRENT GOLD PRICE: $${currentPrice.toFixed(2)}

ARTICLE:
Title: ${article.title}
Source: ${article.source}
Published: ${article.published_at}
Content: ${article.raw_excerpt ?? '(no excerpt available)'}

Return ONLY valid JSON with this exact structure (no markdown, no commentary):
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "impact_score": <integer 0-10>,
  "impact_level": "HIGH" | "MEDIUM" | "LOW",
  "impact_direction": "positive" | "negative" | "mixed",
  "time_horizon": "intraday" | "short" | "medium" | "long",
  "key_levels": {
    "support": [<price1>, <price2>],
    "resistance": [<price1>, <price2>]
  },
  "factors": ["<factor1>", "<factor2>"],
  "summary": "<2-4 sentence analysis of WHY this moves gold, with the mechanism>",
  "action_points": "<1-3 specific, actionable trading guidance sentences>",
  "bull_case": { "price": <number>, "description": "<one sentence scenario>" },
  "base_case": { "price": <number>, "description": "<one sentence scenario>" },
  "bear_case": { "price": <number>, "description": "<one sentence scenario>" },
  "prob_bull": <decimal 0.00-1.00>,
  "z_score": "<e.g. +1.4σ>",
  "expected_move": "<e.g. +$15–$25>",
  "sources_cited": ["<source1>"],
  "confidence": <decimal 0.00-1.00>
}

Guidelines:
- impact_score 8-10 = HIGH (market-moving events: FOMC, NFP, CPI)
- impact_score 5-7 = MEDIUM (supporting factors: DXY moves, CB buying)
- impact_score 0-4 = LOW (noise or marginally related)
- All prices must be realistic given current price of $${currentPrice.toFixed(2)}
- support/resistance arrays must have exactly 2 elements each`
}
