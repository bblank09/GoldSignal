'use client'

import { create } from 'zustand'
import type { NewsFilter, PredictionTF, TimeFrame } from '@/lib/types'

interface UIStore {
  // News feed
  activeFilter: NewsFilter
  activeCategoryId: string | null
  expandedArticleId: string | null
  activeNewsTab: 'today' | 'week' | 'taxonomy' | 'forecasts'

  // Chart
  selectedTF: TimeFrame
  selectedPinId: string | null
  chartLayers: { signals: boolean; news: boolean; volume: boolean }

  // Signals
  selectedPredictionTF: PredictionTF

  // Actions
  setActiveFilter: (f: NewsFilter) => void
  setActiveCategoryId: (id: string | null) => void
  setExpandedArticleId: (id: string | null) => void
  setActiveNewsTab: (tab: 'today' | 'week' | 'taxonomy' | 'forecasts') => void
  setSelectedTF: (tf: TimeFrame) => void
  setSelectedPinId: (id: string | null) => void
  toggleChartLayer: (key: 'signals' | 'news' | 'volume') => void
  setSelectedPredictionTF: (tf: PredictionTF) => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeFilter: 'all',
  activeCategoryId: null,
  expandedArticleId: null,
  activeNewsTab: 'today',

  selectedTF: '1D',
  selectedPinId: null,
  chartLayers: { signals: true, news: true, volume: true },

  selectedPredictionTF: '1D',

  setActiveFilter: (f) => set({ activeFilter: f }),
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),
  setExpandedArticleId: (id) =>
    set((s) => ({ expandedArticleId: s.expandedArticleId === id ? null : id })),
  setActiveNewsTab: (tab) => set({ activeNewsTab: tab }),
  setSelectedTF: (tf) => set({ selectedTF: tf }),
  setSelectedPinId: (id) =>
    set((s) => ({ selectedPinId: s.selectedPinId === id ? null : id })),
  toggleChartLayer: (key) =>
    set((s) => ({ chartLayers: { ...s.chartLayers, [key]: !s.chartLayers[key] } })),
  setSelectedPredictionTF: (tf) => set({ selectedPredictionTF: tf }),
}))
