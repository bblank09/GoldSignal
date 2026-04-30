'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GoldPrice, MacroSnapshot, DailySignal, NewsCategory } from '@/lib/types'
import GoldPriceTicker from '@/components/sidebar/GoldPriceTicker'
import MacroBar from '@/components/sidebar/MacroBar'
import DailyBiasCard from '@/components/sidebar/DailyBiasCard'
import SentimentGauge from '@/components/sidebar/SentimentGauge'
import QuickSignal from '@/components/sidebar/QuickSignal'
import NewsCategoryList from '@/components/sidebar/NewsCategoryList'
import { useUIStore } from '@/lib/store/ui-store'

interface Props {
  price: GoldPrice
  macro: MacroSnapshot
  signal: DailySignal
  categories?: NewsCategory[]
  sentiment?: { bullish: number; bearish: number; neutral: number }
  view: 'feed' | 'signals' | 'chart'
}

export default function Sidebar({ price, macro, signal, categories = [], sentiment, view }: Props) {
  const { activeCategoryId, setActiveCategoryId } = useUIStore()
  const router = useRouter()

  useEffect(() => {
    // Periodically refresh the server components to get updated macro, sentiment, and signal data
    // The price is handled instantly via usePriceStream in GoldPriceTicker
    const intervalId = setInterval(() => {
      router.refresh()
    }, 60000) // 60 seconds
    return () => clearInterval(intervalId)
  }, [router])

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{ width: 260, background: 'var(--bg1)', borderRight: '1px solid var(--bdr)' }}
    >
      <div className="overflow-y-auto flex-1">
        <GoldPriceTicker price={price} />
        <MacroBar macro={macro} />
        <DailyBiasCard signal={signal} />
        <SentimentGauge
          bullish={sentiment?.bullish ?? 0}
          bearish={sentiment?.bearish ?? 0}
          neutral={sentiment?.neutral ?? 0}
        />
        <QuickSignal signal={signal} />
        {view === 'feed' && categories.length > 0 && (
          <NewsCategoryList
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        )}
      </div>
    </div>
  )
}
