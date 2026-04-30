'use client'

import { motion } from 'framer-motion'
import type { ArticleWithAnalysis } from '@/lib/types'
import { useUIStore } from '@/lib/store/ui-store'
import NewsCard from './NewsCard'

interface Props { articles: ArticleWithAnalysis[] }

export default function NewsFeed({ articles }: Props) {
  const { activeFilter, activeCategoryId, expandedArticleId, setExpandedArticleId } = useUIStore()

  const filtered = articles.filter((a) => {
    if (activeCategoryId && a.category_id !== activeCategoryId) return false
    const level = a.analysis.impact_level
    const sent  = a.analysis.sentiment
    if (activeFilter === 'high'    && level !== 'HIGH')     return false
    if (activeFilter === 'bullish' && sent  !== 'Bullish')  return false
    if (activeFilter === 'bearish' && sent  !== 'Bearish')  return false
    if (activeFilter === 'neutral' && sent  !== 'Neutral')  return false
    return true
  })

  return (
    <div className="px-3 py-2 flex flex-col gap-[5px]">
      {filtered.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
        >
          <NewsCard
            item={item}
            expanded={expandedArticleId === item.id}
            onToggle={() => setExpandedArticleId(item.id)}
          />
        </motion.div>
      ))}
      {filtered.length === 0 && (
        <p className="text-t3 text-[11px] italic py-6 text-center">No articles match this filter.</p>
      )}
    </div>
  )
}
