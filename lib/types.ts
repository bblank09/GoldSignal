// ─── Primitive unions ──────────────────────────────────────────────────────────
export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral'
export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type BiasDirection = 'Bullish' | 'Bearish' | 'Neutral'
export type ZoneType = 'Strong' | 'Speculative'
export type Direction = 'up' | 'down' | 'flat'
export type GoldImpact = 'bull' | 'bear' | 'mixed' | 'neut'
export type NewsFilter = 'all' | 'high' | 'bullish' | 'bearish' | 'neutral'
export type TimeFrame = '15m' | '1H' | '4H' | '1D' | '1W'
export type PredictionTF = '4H' | '1D' | '1W' | '1M' | '3M' | '6M' | '12M'
export type ImpactDirection = 'positive' | 'negative' | 'mixed'
export type TimeHorizon = 'intraday' | 'short' | 'medium' | 'long'

// ─── Price ─────────────────────────────────────────────────────────────────────
export interface GoldPrice {
  price: number
  bid: number
  ask: number
  change: number
  change_pct: number
  day_low: number
  day_high: number
  source: 'goldapi.io' | 'yahoo'
  live: boolean
  ts: string
}

// ─── Macro ─────────────────────────────────────────────────────────────────────
export interface MacroValue {
  value: number
  change: number
  direction: Direction
  gold_impact: GoldImpact
}

export interface MacroSnapshot {
  dxy: MacroValue
  us10y: MacroValue
  us2y: MacroValue
  vix: MacroValue
  sp500: MacroValue
  oil_wti: MacroValue
  ts: string
}

// ─── News & Articles ───────────────────────────────────────────────────────────
export interface KeyLevels {
  support: number[]
  resistance: number[]
}

export interface CaseScenario {
  price: number
  description: string
}

export interface Article {
  id: string
  title: string
  source: string
  url: string
  published_at: string
  category_id: string
  factors: string[]
  raw_excerpt: string | null
}

export interface ArticleAnalysis {
  article_id: string
  sentiment: Sentiment
  impact_score: number
  impact_level: ImpactLevel
  impact_direction: ImpactDirection
  time_horizon: TimeHorizon
  key_levels: KeyLevels
  factors: string[]
  summary: string
  action_points: string
  bull_case: CaseScenario
  base_case: CaseScenario
  bear_case: CaseScenario
  prob_bull: number
  z_score: string
  expected_move: string
  sources_cited: string[]
  confidence: number
  generated_at: string
  model: string
}

export type ArticleWithAnalysis = Article & { analysis: ArticleAnalysis }

// ─── Signals ───────────────────────────────────────────────────────────────────
export interface ZoneLevel {
  price: number
  type: ZoneType
  confidence: number
  stop_loss: number
  target: number
  reason: string
}

export interface DailySignal {
  date: string
  bias: BiasDirection
  strength: 1 | 2 | 3 | 4 | 5
  buy_zones: ZoneLevel[]
  sell_zones: ZoneLevel[]
  weekly_outlook: string
  supporting_factors: string[]
  risk_factors: string[]
  executive_summary: string
  generated_at: string
}

// ─── Economic Calendar ─────────────────────────────────────────────────────────
export interface EconomicEvent {
  id: string
  date: string
  iso_date: string
  event: string
  country: string
  importance: ImpactLevel
  forecast: string
  previous: string
  actual: string | null
  gold_impact: string
}

// ─── Multi-TF Predictions ──────────────────────────────────────────────────────
export interface Prediction {
  tf: PredictionTF
  label: string
  price: number
  bull_price: number
  base_price: number
  bear_price: number
  change_pct: number
  confidence: number
  bias: BiasDirection
  reason: string
  drivers: string[]
  risk: string
}

// ─── News Categories ───────────────────────────────────────────────────────────
export interface NewsCategory {
  id: string
  name: string
  color: string
  count: number
  impact: ImpactLevel
  gold_dir: GoldImpact
}

// ─── Chart ─────────────────────────────────────────────────────────────────────
export interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NewsPin {
  id: string
  article_id: string
  time: string
  ts: number
  title: string
  impact: ImpactLevel
  sentiment: Sentiment
  price_effect: string
}

// ─── Taxonomy (View 1 Taxonomy tab) ───────────────────────────────────────────
export interface MechanismItem {
  dir: '▲' | '▼'
  text: string
}

export interface HistoricalMove {
  ev: string
  move: string
  date: string
}

export interface CurrentReading {
  label: string
  val: string
  signal: string
  signalColor: string
  note: string
}

export interface TaxonomyEntry {
  id: string
  icon: string
  iconBg: string
  name: string
  tagline: string
  impactLevel: ImpactLevel
  goldDir: 'bull' | 'bear' | 'mixed'
  desc: string
  mechanism: MechanismItem[]
  historicalMoves: HistoricalMove[]
  current: CurrentReading
}

// ─── Week Events (View 1 Week tab) ────────────────────────────────────────────
export interface WeekEventHistMove {
  ev: string
  move: string
  outcome: string
}

export interface WeekEventCase {
  price: string
  desc: string
}

export interface WeekEvent {
  time: string
  name: string
  country: string
  imp: ImpactLevel
  fore: string
  prev: string
  actual: string | null
  hist: string
  bull: WeekEventCase
  base: WeekEventCase
  bear: WeekEventCase
  histMoves: WeekEventHistMove[]
}

export interface WeekDay {
  day: string
  date: string
  today: boolean
  past: boolean
  events: WeekEvent[]
}

// ─── Forecast (View 1 Forecasts tab) ──────────────────────────────────────────
export interface ForecastRow {
  institution: string
  sub: string
  price: number
  bias: BiasDirection
  upsidePct: number
  reason: string
  date: string
  tier: 1 | 2 | 3
}
