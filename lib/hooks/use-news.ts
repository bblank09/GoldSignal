'use client'

import { useEffect, useState } from 'react'
import type { ArticleWithAnalysis } from '@/lib/types'

export function useNews(categoryId?: string) {
  const [articles, setArticles] = useState<ArticleWithAnalysis[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const url = new URL('/api/news', window.location.origin)
    if (categoryId) url.searchParams.set('category', categoryId)

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<ArticleWithAnalysis[]>
      })
      .then((data) => { if (!cancelled) { setArticles(data); setLoading(false) } })
      .catch((err: Error) => { if (!cancelled) { setError(err.message); setLoading(false) } })

    return () => { cancelled = true }
  }, [categoryId])

  return { articles, loading, error }
}
