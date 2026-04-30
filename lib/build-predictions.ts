import type { Prediction, DailySignal, BiasDirection, PredictionTF } from '@/lib/types'

const TF_CONFIG: { tf: PredictionTF; label: string; scaleFactor: number }[] = [
  { tf: '4H',  label: '4 Hour',   scaleFactor: 0.15 },
  { tf: '1D',  label: 'Daily',    scaleFactor: 1.0  },
  { tf: '1W',  label: 'Weekly',   scaleFactor: 2.5  },
  { tf: '1M',  label: 'Monthly',  scaleFactor: 5.0  },
]

export function buildPredictionsFromSignal(signal: DailySignal, currentPrice: number): Prediction[] {
  const isBull = signal.bias === 'Bullish'
  const isNeutral = signal.bias === 'Neutral'
  
  // Base range from buy/sell zones
  const buyPrices  = signal.buy_zones?.map((z) => z.price) ?? []
  const sellPrices = signal.sell_zones?.map((z) => z.price) ?? []
  const lowestBuy  = buyPrices.length > 0 ? Math.min(...buyPrices) : currentPrice * 0.99
  const highestSell = sellPrices.length > 0 ? Math.max(...sellPrices) : currentPrice * 1.01
  const range = highestSell - lowestBuy

  return TF_CONFIG.map(({ tf, label, scaleFactor }) => {
    const scaledRange = range * scaleFactor
    const direction = isBull ? 1 : isNeutral ? 0.1 : -1
    const targetMove = scaledRange * 0.5 * direction
    
    const predictedPrice = Math.round(currentPrice + targetMove)
    const bullPrice  = Math.round(currentPrice + scaledRange * 0.6)
    const basePrice  = Math.round(currentPrice + scaledRange * 0.1 * direction)
    const bearPrice  = Math.round(currentPrice - scaledRange * 0.5)
    
    const changePct = ((predictedPrice - currentPrice) / currentPrice) * 100
    const confidence = Math.max(0.3, Math.min(0.95, (signal.strength / 5) * (1 - scaleFactor * 0.1)))

    return {
      tf,
      label,
      bias:        signal.bias as BiasDirection,
      price:       predictedPrice,
      change_pct:  Number(changePct.toFixed(2)),
      confidence:  Number(confidence.toFixed(2)),
      bull_price:  bullPrice,
      base_price:  basePrice,
      bear_price:  bearPrice,
      reason:      signal.executive_summary || `${signal.bias} bias based on ${signal.strength}/5 signal strength`,
      drivers:     signal.supporting_factors?.slice(0, 3) ?? [],
      risk:        signal.risk_factors?.[0] ?? 'Market volatility',
    }
  })
}
