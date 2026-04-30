import type { ArticleWithAnalysis, MacroSnapshot } from '@/lib/types'

export function buildDailySynthesisPrompt(
  articles: ArticleWithAnalysis[],
  macro: MacroSnapshot,
  currentPrice: number,
): string {
  const summaries = articles
    .sort((a, b) => b.analysis.impact_score - a.analysis.impact_score)
    .slice(0, 10)
    .map((a) => `- [${a.analysis.impact_level} ${a.analysis.sentiment}] ${a.title}: ${a.analysis.summary}`)
    .join('\n')

  return `You are a senior gold market strategist. Based on today's news and current macro data, generate a comprehensive daily signal for XAU/USD.

CURRENT GOLD PRICE: $${currentPrice.toFixed(2)}
DATE: ${new Date().toISOString().split('T')[0]}

MACRO ENVIRONMENT:
- DXY: ${macro.dxy.value} (${macro.dxy.direction === 'down' ? '↓' : '↑'} ${macro.dxy.change})
- US 10Y Yield: ${macro.us10y.value}% (${macro.us10y.direction === 'down' ? '↓' : '↑'} ${macro.us10y.change})
- US 2Y Yield: ${macro.us2y.value}% (${macro.us2y.direction === 'down' ? '↓' : '↑'} ${macro.us2y.change})
- VIX: ${macro.vix.value} (${macro.vix.direction === 'up' ? '↑' : '↓'} ${macro.vix.change})
- SPX: ${macro.sp500.value} (${macro.sp500.change})
- WTI Oil: ${macro.oil_wti.value} (${macro.oil_wti.change})

TODAY'S TOP NEWS (by impact):
${summaries}

Return ONLY valid JSON with this exact structure:
{
  "bias": "Bullish" | "Bearish" | "Neutral",
  "strength": <integer 1-5>,
  "buy_zones": [
    {
      "price": <number>,
      "type": "Strong" | "Speculative",
      "confidence": <decimal 0.00-1.00>,
      "stop_loss": <number>,
      "target": <number>,
      "reason": "<one sentence>"
    }
  ],
  "sell_zones": [
    {
      "price": <number>,
      "type": "Strong" | "Speculative",
      "confidence": <decimal 0.00-1.00>,
      "stop_loss": <number>,
      "target": <number>,
      "reason": "<one sentence>"
    }
  ],
  "weekly_outlook": "<2-3 paragraph synthesis of the week ahead>",
  "supporting_factors": ["<factor1>", "<factor2>", "<factor3>", "<factor4>"],
  "risk_factors": ["<risk1>", "<risk2>", "<risk3>", "<risk4>"],
  "executive_summary": "<one sentence combining the 3 most important drivers>"
}

Guidelines:
- buy_zones: 2 entries — one Strong support, one Speculative
- sell_zones: 2 entries — one Strong resistance, one Speculative
- All prices must be realistic around current price $${currentPrice.toFixed(2)}
- stop_loss for buy zones below support; stop_loss for sell zones above resistance
- strength 5 = very high conviction, 1 = weak signal`
}
