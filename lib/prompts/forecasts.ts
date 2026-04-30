import type { ArticleWithAnalysis, MacroSnapshot } from '@/lib/types'

export function buildForecastsPrompt(
  articles: ArticleWithAnalysis[],
  macro: MacroSnapshot,
  currentPrice: number,
): string {
  const newsSummaries = articles
    .filter(a => a.analysis)
    .sort((a, b) => b.analysis.impact_score - a.analysis.impact_score)
    .slice(0, 8)
    .map(a => `- [${a.source}] ${a.title}: ${a.analysis.summary}`)
    .join('\n')

  return `You are a senior gold market research analyst. Based on the current market data and news, compile a table of gold price forecasts from major financial institutions and investment banks.

CURRENT GOLD PRICE: $${currentPrice.toFixed(2)}
DATE: ${new Date().toISOString().split('T')[0]}

MACRO CONTEXT:
- DXY: ${macro.dxy.value} (${macro.dxy.direction === 'down' ? '↓' : '↑'} ${macro.dxy.change})
- US 10Y: ${macro.us10y.value}% (${macro.us10y.direction === 'down' ? '↓' : '↑'} ${macro.us10y.change})
- VIX: ${macro.vix.value}
- SPX: ${macro.sp500.value}
- Oil: ${macro.oil_wti.value}

RECENT NEWS:
${newsSummaries}

IMPORTANT: Generate forecasts that reflect what major institutions are ACTUALLY projecting based on current market conditions. Use the latest publicly known institutional forecasts and research notes. Every forecast must cite a real institution.

Return ONLY valid JSON array with this structure:
[
  {
    "institution": "<real institution name>",
    "analyst": "<analyst name if known, otherwise null>",
    "target": <price number>,
    "timeframe": "<e.g. Q2 2026, Year-end 2026, 12-month>",
    "bias": "Bullish" | "Bearish" | "Neutral",
    "rationale": "<1-2 sentence reasoning>",
    "source": "<research note name or report title>",
    "last_updated": "<approximate date of forecast, e.g. Apr 2026>",
    "confidence": "<HIGH|MEDIUM|LOW based on institution track record>"
  }
]

Guidelines:
- Include 6-8 institutions (e.g. Goldman Sachs, JP Morgan, UBS, Citi, HSBC, Bank of America, World Gold Council, etc.)
- Forecasts should be realistic given current price of $${currentPrice.toFixed(2)}
- Cite specific research reports or outlook publications where possible
- Include a mix of timeframes (near-term and year-end)
- Mark confidence based on institution's historical accuracy in gold forecasting`
}
