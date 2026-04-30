import type { TaxonomyEntry, MechanismItem, MacroSnapshot, MacroValue } from '@/lib/types'

const TAXONOMY_DEFINITIONS: {
  id: string
  name: string
  icon: string
  iconBg: string
  tagline: string
  desc: string
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  goldDir: 'bull' | 'bear' | 'mixed'
  mechanism: MechanismItem[]
  historicalMoves: { ev: string; move: string; date: string }[]
  macroKey?: 'dxy' | 'us10y' | 'us2y' | 'vix' | 'sp500' | 'oil_wti'
  currentLabel: string
}[] = [
  {
    id: 'fed',
    name: 'Federal Reserve & Interest Rates',
    icon: '🏦',
    iconBg: 'rgba(245,158,11,.15)',
    tagline: 'Most dominant gold driver — rate expectations set the floor',
    desc: 'Gold has zero yield, so when real rates rise, gold becomes less attractive relative to bonds. The Fed funds rate, dot plots, and forward guidance drive 40-60% of gold\'s major moves.',
    impactLevel: 'HIGH',
    goldDir: 'bull',
    mechanism: [
      { dir: '▲' as const, text: 'Dovish Fed / rate cut signals → lower real yields → gold rises' },
      { dir: '▼' as const, text: 'Hawkish Fed / rate hike expectations → higher yields → gold drops' },
    ],
    historicalMoves: [
      { ev: 'Fed pivot signal', move: '+$120', date: 'Dec 2023' },
      { ev: 'Emergency cut', move: '+$180', date: 'Mar 2020' },
      { ev: 'Hawkish surprise', move: '-$95', date: 'Sep 2022' },
    ],
    macroKey: undefined,
    currentLabel: 'Fed Funds Rate',
  },
  {
    id: 'dxy',
    name: 'US Dollar Index (DXY)',
    icon: '💵',
    iconBg: 'rgba(59,130,246,.15)',
    tagline: 'Strong inverse correlation — gold\'s primary FX driver',
    desc: 'Gold is priced in USD. A stronger dollar makes gold more expensive for non-USD buyers, reducing demand. The DXY index captures broad dollar strength against major currencies.',
    impactLevel: 'HIGH',
    goldDir: 'bear',
    mechanism: [
      { dir: '▲' as const, text: 'DXY weakens → gold cheaper for global buyers → price rises' },
      { dir: '▼' as const, text: 'DXY strengthens → gold expensive in other currencies → selling pressure' },
    ],
    historicalMoves: [
      { ev: 'DXY drop to 100', move: '+$160', date: 'Nov 2022' },
      { ev: 'DXY surge to 114', move: '-$200', date: 'Sep 2022' },
      { ev: 'DXY at 90', move: '+$400', date: '2020-2021' },
    ],
    macroKey: 'dxy',
    currentLabel: 'DXY Index',
  },
  {
    id: 'yield',
    name: 'US Treasury Yields',
    icon: '📊',
    iconBg: 'rgba(139,92,246,.15)',
    tagline: 'Real yields are the opportunity cost of holding gold',
    desc: 'The 10-year real yield (nominal minus inflation expectations) is the single best predictor of gold direction. When real yields fall, gold rallies as the cost of holding a zero-yield asset decreases.',
    impactLevel: 'HIGH',
    goldDir: 'bear',
    mechanism: [
      { dir: '▲' as const, text: 'Yields fall → gold becomes relatively more attractive → buying' },
      { dir: '▼' as const, text: 'Yields rise → bonds compete with gold → selling' },
    ],
    historicalMoves: [
      { ev: '10Y below 1%', move: '+$200', date: 'Aug 2020' },
      { ev: '10Y to 5%', move: '-$100', date: 'Oct 2023' },
      { ev: 'Yield inversion', move: '+$80', date: 'Jul 2022' },
    ],
    macroKey: 'us10y',
    currentLabel: 'US 10Y Yield',
  },
  {
    id: 'infl',
    name: 'Inflation & CPI',
    icon: '🔥',
    iconBg: 'rgba(239,68,68,.15)',
    tagline: 'Gold is the original inflation hedge — but nuanced',
    desc: 'Gold historically preserves purchasing power during inflationary periods. However, if inflation triggers aggressive rate hikes, the rate effect can overwhelm the inflation-hedge bid.',
    impactLevel: 'HIGH',
    goldDir: 'bull',
    mechanism: [
      { dir: '▲' as const, text: 'Rising inflation expectations → inflation hedge demand → gold rises' },
      { dir: '▼' as const, text: 'Inflation cooling → less urgency for hedge → gold neutral' },
    ],
    historicalMoves: [
      { ev: 'CPI hits 9.1%', move: '-$60', date: 'Jun 2022' },
      { ev: 'PCE misses', move: '+$40', date: 'Apr 2024' },
      { ev: 'Stagflation fears', move: '+$120', date: 'Mar 2022' },
    ],
    macroKey: undefined,
    currentLabel: 'US CPI YoY',
  },
  {
    id: 'geo',
    name: 'Geopolitics & Safe Haven',
    icon: '🌍',
    iconBg: 'rgba(236,72,153,.15)',
    tagline: 'Conflict = immediate bid for gold as risk-off asset',
    desc: 'Geopolitical crises trigger safe-haven flows into gold. The effect is usually sharp but temporary unless the crisis is prolonged or escalates to affect energy supply and inflation.',
    impactLevel: 'MEDIUM',
    goldDir: 'bull',
    mechanism: [
      { dir: '▲' as const, text: 'Military conflict / sanctions → safe haven bid → gold spikes' },
      { dir: '▼' as const, text: 'De-escalation / peace talks → risk-on → gold gives back gains' },
    ],
    historicalMoves: [
      { ev: 'Russia-Ukraine', move: '+$100', date: 'Feb 2022' },
      { ev: 'Israel-Hamas', move: '+$80', date: 'Oct 2023' },
      { ev: 'Trump tariffs', move: '+$60', date: 'Apr 2025' },
    ],
    macroKey: 'vix',
    currentLabel: 'VIX (Fear)',
  },
  {
    id: 'cb',
    name: 'Central Bank Gold Buying',
    icon: '🏛️',
    iconBg: 'rgba(249,115,22,.15)',
    tagline: 'Structural demand floor — PBOC, RBI, Turkey leading buyers',
    desc: 'Central banks have been net buyers since 2010, with purchases accelerating after Russia\'s reserves were frozen. This creates a structural demand floor that limits downside.',
    impactLevel: 'MEDIUM',
    goldDir: 'bull',
    mechanism: [
      { dir: '▲' as const, text: 'Central bank buying announced → structural demand confirmed → bullish' },
      { dir: '▼' as const, text: 'Central bank pause → demand concern → mild bearish' },
    ],
    historicalMoves: [
      { ev: 'PBOC 18-month run', move: '+$500', date: '2023-2024' },
      { ev: 'Turkey buying', move: '+$80', date: '2022' },
      { ev: 'Q1 2026 +244t', move: '+$200', date: 'Q1 2026' },
    ],
    macroKey: undefined,
    currentLabel: 'Q1 Purchases',
  },
]

function getMacroValue(macro: MacroSnapshot, key: string): MacroValue | null {
  const val = macro[key as keyof MacroSnapshot]
  if (typeof val === 'string') return null
  return val as MacroValue
}

export function buildTaxonomy(macro?: MacroSnapshot): TaxonomyEntry[] {
  return TAXONOMY_DEFINITIONS.map((def) => {
    let currentVal = '--'
    let signal = 'NEUTRAL'
    let signalColor = 'var(--t3)'
    let note = 'No live data available'

    if (macro && def.macroKey) {
      const m = getMacroValue(macro, def.macroKey)
      if (m) {
        currentVal = `${m.value}`
        const isDown = m.direction === 'down'

        if (def.id === 'dxy') {
          signal = isDown ? 'BULLISH FOR GOLD' : 'BEARISH FOR GOLD'
          signalColor = isDown ? 'var(--bull)' : 'var(--bear)'
          note = `DXY ${isDown ? 'weakening' : 'strengthening'} (${m.change}) — ${isDown ? 'positive' : 'negative'} for gold`
        } else if (def.id === 'yield') {
          signal = isDown ? 'BULLISH FOR GOLD' : 'BEARISH FOR GOLD'
          signalColor = isDown ? 'var(--bull)' : 'var(--bear)'
          note = `10Y yield at ${m.value}% (${m.change}) — ${isDown ? 'falling yields support gold' : 'rising yields pressure gold'}`
        } else if (def.id === 'geo') {
          const highFear = m.value > 20
          signal = highFear ? 'ELEVATED FEAR' : 'LOW FEAR'
          signalColor = highFear ? 'var(--bull)' : 'var(--t3)'
          note = `VIX at ${m.value} — ${highFear ? 'elevated fear supports safe haven gold' : 'complacency reduces safe haven bid'}`
        }
      }
    }

    return {
      id: def.id,
      name: def.name,
      icon: def.icon,
      iconBg: def.iconBg,
      tagline: def.tagline,
      desc: def.desc,
      impactLevel: def.impactLevel,
      goldDir: def.goldDir,
      mechanism: def.mechanism,
      historicalMoves: def.historicalMoves,
      current: {
        label: def.currentLabel,
        val: currentVal,
        signal,
        signalColor,
        note,
      },
    }
  })
}
