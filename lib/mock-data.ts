import type {
  Article,
  ArticleAnalysis,
  ArticleWithAnalysis,
  GoldPrice,
  MacroSnapshot,
  DailySignal,
  EconomicEvent,
  NewsCategory,
  Prediction,
  Candle,
  NewsPin,
  TaxonomyEntry,
  WeekDay,
  ForecastRow,
} from './types'

// ─── Gold Price ────────────────────────────────────────────────────────────────
export const mockGoldPrice: GoldPrice = {
  price: 2341.50,
  bid: 2341.20,
  ask: 2341.80,
  change: 18.30,
  change_pct: 0.79,
  day_low: 2318.40,
  day_high: 2349.90,
  source: 'goldapi.io',
  live: true,
  ts: new Date().toISOString(),
}

// ─── Macro Snapshot ────────────────────────────────────────────────────────────
export const mockMacro: MacroSnapshot = {
  dxy:     { value: 104.23, change: -0.31, direction: 'down', gold_impact: 'bull' },
  us10y:   { value: 4.28,   change: -0.05, direction: 'down', gold_impact: 'bull' },
  us2y:    { value: 4.61,   change: -0.03, direction: 'down', gold_impact: 'bull' },
  vix:     { value: 16.82,  change:  0.44, direction: 'up',   gold_impact: 'bull' },
  sp500:   { value: 5267.0, change: 12.4,  direction: 'up',   gold_impact: 'neut' },
  oil_wti: { value: 78.42,  change: -0.88, direction: 'down', gold_impact: 'neut' },
  ts: new Date().toISOString(),
}

// ─── News Categories ───────────────────────────────────────────────────────────
export const mockCategories: NewsCategory[] = [
  { id: 'fed',   name: 'Central Bank Policy', color: '#EF4444', count: 4, impact: 'HIGH',   gold_dir: 'bull' },
  { id: 'dxy',   name: 'USD / DXY',           color: '#F59E0B', count: 3, impact: 'HIGH',   gold_dir: 'bull' },
  { id: 'infl',  name: 'Inflation Data',      color: '#F59E0B', count: 3, impact: 'HIGH',   gold_dir: 'bull' },
  { id: 'geo',   name: 'Geopolitical Risk',   color: '#A78BFA', count: 2, impact: 'MEDIUM', gold_dir: 'bull' },
  { id: 'yield', name: 'Treasury Yields',     color: '#3B82F6', count: 3, impact: 'HIGH',   gold_dir: 'bull' },
  { id: 'etf',   name: 'ETF & Flows',         color: '#22C55E', count: 2, impact: 'MEDIUM', gold_dir: 'bull' },
  { id: 'cb',    name: 'Central Bank Buying', color: '#D4A843', count: 2, impact: 'HIGH',   gold_dir: 'bull' },
  { id: 'tech',  name: 'Technical Breakout',  color: '#64748B', count: 1, impact: 'MEDIUM', gold_dir: 'mixed' },
  { id: 'cot',   name: 'COT Positioning',     color: '#94A3B8', count: 1, impact: 'LOW',    gold_dir: 'mixed' },
  { id: 'macro', name: 'Macro / Growth Data', color: '#6366F1', count: 2, impact: 'MEDIUM', gold_dir: 'mixed' },
]

// ─── Articles ──────────────────────────────────────────────────────────────────
export const mockArticles: Article[] = [
  { id: '1', title: 'Federal Reserve Minutes Signal Openness to Rate Cuts as Inflation Cools',
    source: 'Reuters', url: 'https://reuters.com/1', published_at: '2026-04-28T14:22:00Z',
    category_id: 'fed', factors: ['Fed Rate', 'Inflation', 'DXY'], raw_excerpt: null },
  { id: '2', title: "China's Central Bank Adds 18 Tonnes of Gold in April, Extends 18-Month Buying Streak",
    source: 'World Gold Council', url: 'https://gold.org/2', published_at: '2026-04-28T12:08:00Z',
    category_id: 'cb', factors: ['Central Bank', 'Safe Haven'], raw_excerpt: null },
  { id: '3', title: 'US Dollar Index Retreats to 3-Week Low on Weak Retail Sales Data',
    source: 'Kitco', url: 'https://kitco.com/3', published_at: '2026-04-28T10:45:00Z',
    category_id: 'dxy', factors: ['DXY', 'Macro Data'], raw_excerpt: null },
  { id: '4', title: 'Middle East Tensions Escalate as Ceasefire Talks Stall in Cairo',
    source: 'Reuters', url: 'https://reuters.com/4', published_at: '2026-04-28T08:30:00Z',
    category_id: 'geo', factors: ['Geopolitical', 'Safe Haven'], raw_excerpt: null },
  { id: '5', title: 'US 10-Year Treasury Yield Drops to 4.28% Ahead of CPI Data',
    source: 'MarketWatch', url: 'https://marketwatch.com/5', published_at: '2026-04-28T07:15:00Z',
    category_id: 'yield', factors: ['US10Y', 'Fed Rate', 'Inflation'], raw_excerpt: null },
]

// ─── Article Analyses ──────────────────────────────────────────────────────────
const analysisMap: Record<string, ArticleAnalysis> = {
  '1': {
    article_id: '1', sentiment: 'Bullish', impact_score: 9, impact_level: 'HIGH',
    impact_direction: 'positive', time_horizon: 'short',
    key_levels: { support: [2310, 2290], resistance: [2350, 2380] },
    factors: ['Fed Rate', 'Inflation', 'DXY'],
    summary: "The Federal Reserve's latest meeting minutes revealed growing consensus that inflation is on a sustainable path lower. Several members expressed openness to beginning rate cuts before year-end — directly weakening the dollar and reducing real Treasury yields, both mechanically bullish for non-yielding gold. Market pricing now implies 2.3 cuts in 2024.",
    action_points: 'Strong buy signal on any pullback to $2,310–$2,290. Fed pivot is the single biggest structural driver for gold in 2024. Stop below $2,270.',
    bull_case: { price: 2380, description: 'Fed confirms H2 cut; dollar sell-off accelerates' },
    base_case: { price: 2345, description: 'Gradual dovish tone, market consolidates' },
    bear_case: { price: 2290, description: 'Strong CPI Wed reverses Fed cut expectations' },
    prob_bull: 0.82, z_score: '+1.8σ', expected_move: '+$22–$35',
    sources_cited: ['Federal Reserve', 'CME FedWatch Tool'],
    confidence: 0.88, generated_at: new Date().toISOString(), model: 'claude-sonnet-4-5',
  },
  '2': {
    article_id: '2', sentiment: 'Bullish', impact_score: 7, impact_level: 'HIGH',
    impact_direction: 'positive', time_horizon: 'medium',
    key_levels: { support: [2280, 2260], resistance: [2360, 2400] },
    factors: ['Central Bank', 'Safe Haven'],
    summary: "The People's Bank of China continued its gold accumulation program in April, purchasing 18 tonnes to bring total reserves to 2,264 tonnes. This marks 18 consecutive months of buying, reflecting de-dollarization strategy. Sustained central bank demand provides a structural demand floor for gold prices.",
    action_points: 'Confirms long-term bull thesis. No immediate trade trigger but reinforces holding long positions. Central bank demand is absorbing supply and supporting price floor around $2,280–$2,300.',
    bull_case: { price: 2360, description: 'Other CBs follow PBoC; demand floor rises' },
    base_case: { price: 2340, description: 'Steady CB buying continues, price supported' },
    bear_case: { price: 2300, description: 'CB buying pauses; speculative longs exit' },
    prob_bull: 0.74, z_score: '+1.2σ', expected_move: '+$12–$20',
    sources_cited: ['PBoC', 'World Gold Council'],
    confidence: 0.82, generated_at: new Date().toISOString(), model: 'claude-sonnet-4-5',
  },
  '3': {
    article_id: '3', sentiment: 'Bullish', impact_score: 6, impact_level: 'MEDIUM',
    impact_direction: 'positive', time_horizon: 'intraday',
    key_levels: { support: [2320, 2300], resistance: [2345, 2360] },
    factors: ['DXY', 'Macro Data'],
    summary: "The DXY fell to 103.80 after US retail sales came in at −0.3% vs −0.1% expected, signaling consumer spending weakness. A weaker dollar directly supports gold prices through the inverse correlation, and soft economic data increases the probability of earlier Fed cuts.",
    action_points: 'Mildly bullish — provides near-term support. Watch DXY; if it breaks below 103.50, expect gold to challenge $2,360.',
    bull_case: { price: 2360, description: 'DXY breaks 103.50; gold tests resistance' },
    base_case: { price: 2330, description: 'DXY stabilises; gold holds current range' },
    bear_case: { price: 2310, description: 'DXY bounces on risk-off; gold pulls back' },
    prob_bull: 0.65, z_score: '+0.8σ', expected_move: '+$8–$15',
    sources_cited: ['US Census Bureau', 'DXY Chart'],
    confidence: 0.71, generated_at: new Date().toISOString(), model: 'claude-sonnet-4-5',
  },
  '4': {
    article_id: '4', sentiment: 'Bullish', impact_score: 5, impact_level: 'MEDIUM',
    impact_direction: 'positive', time_horizon: 'short',
    key_levels: { support: [2315, 2295], resistance: [2350, 2370] },
    factors: ['Geopolitical', 'Safe Haven'],
    summary: 'Renewed uncertainty in Middle East peace negotiations drove safe haven demand in early Asian trading. Gold briefly spiked to $2,349 on the headlines before settling. Geopolitical risk premium typically adds $20–$50 to gold prices during elevated conflict periods.',
    action_points: 'Background supportive factor. Not actionable on its own but contributes to the overall bullish bias. Monitor for escalation — a sharp move would be buy-the-dip opportunity.',
    bull_case: { price: 2370, description: 'Full conflict escalation; sustained safe haven bid' },
    base_case: { price: 2340, description: 'Simmering tension; modest $10–15 premium' },
    bear_case: { price: 2315, description: 'Talks resume; risk premium fully unwinds' },
    prob_bull: 0.60, z_score: '+0.5σ', expected_move: '+$5–$20',
    sources_cited: ['Reuters', 'AP News'],
    confidence: 0.65, generated_at: new Date().toISOString(), model: 'claude-sonnet-4-5',
  },
  '5': {
    article_id: '5', sentiment: 'Bullish', impact_score: 7, impact_level: 'HIGH',
    impact_direction: 'positive', time_horizon: 'short',
    key_levels: { support: [2310, 2290], resistance: [2360, 2380] },
    factors: ['US10Y', 'Fed Rate', 'Inflation'],
    summary: 'The benchmark 10-year Treasury yield fell 5 basis points to 4.28% as investors positioned ahead of Wednesday\'s CPI release. Lower nominal yields reduce the opportunity cost of holding gold, mechanically supportive. If CPI prints below 3.4% consensus, expect yields to fall further and gold to rally.',
    action_points: 'High conviction setup: if CPI < 3.4% on Wednesday, initiate longs at market open targeting $2,360. Pre-position small longs at $2,325–$2,330 ahead of the print.',
    bull_case: { price: 2380, description: 'CPI miss + yield collapse; real yield < 2%' },
    base_case: { price: 2350, description: 'Soft CPI; yields fall modestly to 4.20%' },
    bear_case: { price: 2300, description: 'Hot CPI; yields spike to 4.45%; gold sells off' },
    prob_bull: 0.76, z_score: '+1.4σ', expected_move: '+$18–$30',
    sources_cited: ['US Treasury', 'MarketWatch'],
    confidence: 0.80, generated_at: new Date().toISOString(), model: 'claude-sonnet-4-5',
  },
}

export const mockArticlesWithAnalysis: ArticleWithAnalysis[] = mockArticles.map((a) => ({
  ...a,
  analysis: analysisMap[a.id],
}))

// ─── Daily Signal ──────────────────────────────────────────────────────────────
export const mockDailySignal: DailySignal = {
  date: '2026-04-28',
  bias: 'Bullish',
  strength: 4,
  buy_zones: [
    { price: 2310, type: 'Strong',      confidence: 0.84, stop_loss: 2270, target: 2380, reason: 'Fed pivot + weekly technical support confluence' },
    { price: 2290, type: 'Speculative', confidence: 0.61, stop_loss: 2260, target: 2360, reason: 'Major weekly support, oversold on RSI' },
  ],
  sell_zones: [
    { price: 2380, type: 'Strong',      confidence: 0.79, stop_loss: 2410, target: 2310, reason: 'Prior all-time high resistance zone' },
    { price: 2420, type: 'Speculative', confidence: 0.55, stop_loss: 2450, target: 2350, reason: 'Psychological round number + overbought divergence' },
  ],
  weekly_outlook: "Gold remains in a constructive technical posture above $2,300. The key catalyst this week is Wednesday's US CPI print — a softer reading would push real yields lower and likely drive a test of $2,360–$2,380 resistance. Central bank demand from China and Poland continues to provide a demand floor. Downside risk is limited unless DXY reclaims 105.50.",
  supporting_factors: [
    'Fed signaling rate cut openness in H2 2024',
    'China PBoC added 18 tonnes in April',
    'Middle East risk premium sustaining safe haven bid',
    'Real yields declining as nominal yields fall',
  ],
  risk_factors: [
    'Strong US jobs data could delay Fed cuts',
    'DXY showing technical recovery attempt',
    'India gold demand seasonally weak',
    'Profit-taking risk after 12% YTD gain',
  ],
  executive_summary: 'Fed dovish pivot + central bank buying + geopolitical safe haven demand',
  generated_at: new Date().toISOString(),
}

// ─── Economic Events ───────────────────────────────────────────────────────────
export const mockEvents: EconomicEvent[] = [
  { id: 'e1', date: 'Wed May 14', iso_date: '2026-05-14T12:30:00Z', event: 'US CPI (Apr)',         country: 'US', importance: 'HIGH',   forecast: '3.4%',  previous: '3.5%',  actual: null, gold_impact: 'Below forecast = bullish gold' },
  { id: 'e2', date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US PPI (Apr)',          country: 'US', importance: 'HIGH',   forecast: '0.3%',  previous: '0.2%',  actual: null, gold_impact: 'Soft PPI = bullish via Fed cut odds' },
  { id: 'e3', date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US Retail Sales (Apr)', country: 'US', importance: 'MEDIUM', forecast: '-0.1%', previous: '-0.3%', actual: null, gold_impact: 'Weak = bullish via USD weakness' },
  { id: 'e4', date: 'Fri May 16', iso_date: '2026-05-16T14:00:00Z', event: 'US Consumer Sentiment', country: 'US', importance: 'MEDIUM', forecast: '76.2',  previous: '77.2',  actual: null, gold_impact: 'Low sentiment = mild safe haven bid' },
  { id: 'e5', date: 'Wed May 21', iso_date: '2026-05-21T18:00:00Z', event: 'FOMC Meeting Minutes',  country: 'US', importance: 'HIGH',   forecast: 'N/A',   previous: 'N/A',   actual: null, gold_impact: 'Dovish tone = strongly bullish' },
  { id: 'e6', date: 'Fri May 23', iso_date: '2026-05-23T12:30:00Z', event: 'US PCE Deflator (Apr)', country: 'US', importance: 'HIGH',   forecast: '2.7%',  previous: '2.7%',  actual: null, gold_impact: 'Below 2.7% = bullish for rate cut timing' },
]

// ─── Multi-TF Predictions ──────────────────────────────────────────────────────
export const mockPredictions: Prediction[] = [
  { tf: '4H',  label: '4 Hours',   price: 2358, bull_price: 2375, base_price: 2352, bear_price: 2318, change_pct:  0.54, confidence: 0.72, bias: 'Bullish', reason: 'Momentum positive — MACD bullish cross, RSI trending up from 58. Short-term support at $2,320. CPI event risk Wed.', drivers: ['MACD Bullish Cross', 'RSI Uptrend', 'Pre-CPI positioning'], risk: 'Hot CPI print Wednesday could reverse intraday gains sharply.' },
  { tf: '1D',  label: '1 Day',     price: 2385, bull_price: 2420, base_price: 2375, bear_price: 2290, change_pct:  1.35, confidence: 0.74, bias: 'Bullish', reason: 'Daily bias bullish 4/5. Fed dovish minutes + PBoC buying confirmed. DXY under pressure. Key test: CPI data Wed 08:30.', drivers: ['Fed Minutes Dovish', 'PBoC 18t Buy', 'DXY Decline'], risk: 'CPI beat (>3.6%) would trigger sharp reversal toward $2,290.' },
  { tf: '1W',  label: '1 Week',    price: 2420, bull_price: 2480, base_price: 2410, bear_price: 2260, change_pct:  2.40, confidence: 0.71, bias: 'Bullish', reason: 'NFP Friday key risk event. CPI Wednesday. If both soft — gold targets $2,480. Tech structure: higher lows intact above $2,250 base.', drivers: ['CPI Soft Scenario', 'NFP Weak', 'Yield Decline Cont.'], risk: 'Strong NFP (+350K) could push gold to $2,260 support zone.' },
  { tf: '1M',  label: '1 Month',   price: 2520, bull_price: 2700, base_price: 2480, bear_price: 2200, change_pct:  5.40, confidence: 0.68, bias: 'Bullish', reason: 'May: FOMC minutes, PCE data, multiple Fed speakers. Base case: 1 Fed cut pricing in by June = lower real yields = gold rallies.', drivers: ['FOMC Minutes May 21', 'PCE Data', 'ETF Inflows Signal'], risk: 'If no cut signal by June — speculative longs unwind. Dollar recovery possible.' },
  { tf: '3M',  label: '3 Months',  price: 2750, bull_price: 3100, base_price: 2680, bear_price: 2100, change_pct: 12.3,  confidence: 0.64, bias: 'Bullish', reason: 'Q2–Q3 2026: Fed first cut likely June–July. Real yields decline as cuts priced. ETF inflows expected to accelerate. CB demand structural.', drivers: ['Fed First Cut Q2', 'Real Yield Decline', 'ETF Re-entry'], risk: 'If CPI re-accelerates in May–Jun — cuts delayed → gold correction to $2,100.' },
  { tf: '6M',  label: '6 Months',  price: 3200, bull_price: 3800, base_price: 3100, bear_price: 2000, change_pct: 25.7,  confidence: 0.60, bias: 'Bullish', reason: 'Oct 2026: Post-cut cycle rally. Institutional target convergence $3,000–$4,800. CB demand 755t+ for year provides structural floor.', drivers: ['Fed Cut Cycle', 'CB 755t Demand', 'Institutional ETF Entry'], risk: 'Geopolitical resolution + strong growth data could cap gains at $2,500.' },
  { tf: '12M', label: '12 Months', price: 4055, bull_price: 5300, base_price: 3900, bear_price: 2500, change_pct: 51.4,  confidence: 0.65, bias: 'Bullish', reason: 'YE 2026: JPM base $4,000 · Goldman $4,500 · T1 avg $4,617. All major institutions bullish. 14/14 institutions with positive bias.', drivers: ['Institutional Consensus', 'De-dollarization Trend', 'Fed Full Cut Cycle'], risk: 'Bear case requires: Fed hiking + CB buying stop + ETF outflows + DXY >110.' },
]

// ─── News Pins (for chart) ─────────────────────────────────────────────────────
export const mockNewsPins: NewsPin[] = [
  { id: 'p1', article_id: '1', time: '14:22', ts: 0, title: 'Fed Minutes: Openness to Rate Cuts',       impact: 'HIGH',   sentiment: 'Bullish', price_effect: '+$22' },
  { id: 'p2', article_id: '2', time: '12:08', ts: 0, title: 'PBoC Adds 18t Gold — Month 18',            impact: 'HIGH',   sentiment: 'Bullish', price_effect: '+$12' },
  { id: 'p3', article_id: '3', time: '10:45', ts: 0, title: 'DXY Falls to 3-Week Low',                 impact: 'MEDIUM', sentiment: 'Bullish', price_effect: '+$8'  },
  { id: 'p4', article_id: '4', time: '08:30', ts: 0, title: 'Middle East Talks Collapse',              impact: 'MEDIUM', sentiment: 'Bullish', price_effect: '+$14' },
  { id: 'p5', article_id: '5', time: '07:15', ts: 0, title: 'US 10Y Yield Drops to 4.28%',             impact: 'HIGH',   sentiment: 'Bullish', price_effect: '+$18' },
]

// ─── Candle data ───────────────────────────────────────────────────────────────
export function generateMockCandles(): Candle[] {
  const out: Candle[] = []
  const now = Math.floor(Date.now() / 1000)
  const DAY = 86400
  let price = 2200
  for (let i = 89; i >= 0; i--) {
    const t = now - i * DAY
    const d = new Date(t * 1000)
    const time = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const trend = i > 60 ? 0.003 : i > 30 ? 0.008 : i > 10 ? -0.015 : 0.005
    const noise = (Math.random() - 0.48) * 0.022
    const open = price
    const close = price * (1 + trend + noise)
    const high = Math.max(open, close) * (1 + Math.random() * 0.008)
    const low = Math.min(open, close) * (1 - Math.random() * 0.008)
    out.push({ time, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), volume: Math.round(80000 + Math.random() * 40000) })
    price = close
  }
  return out
}
export const mockCandles: Candle[] = generateMockCandles()

// ─── Taxonomy (View 1 Taxonomy tab) ───────────────────────────────────────────
export const mockTaxonomy: TaxonomyEntry[] = [
  {
    id: 't1', icon: '🏛️', iconBg: '#200D0D', name: 'Central Bank Policy (Fed/ECB/BOJ)',
    tagline: 'Primary structural driver — rate expectations move gold most.',
    impactLevel: 'HIGH', goldDir: 'bull',
    desc: "Changes in central bank interest rate expectations are the single most powerful driver of gold prices. Gold is a non-yielding asset, so when interest rates fall (or are expected to fall), the opportunity cost of holding gold decreases, making it more attractive relative to bonds and cash.",
    mechanism: [
      { dir: '▲', text: 'Rate cut signals → real yields fall → gold rises (inverse relationship)' },
      { dir: '▲', text: 'Quantitative easing → money supply expands → inflation hedge demand' },
      { dir: '▼', text: 'Rate hikes → higher yields → capital flows to bonds → gold falls' },
      { dir: '▼', text: 'Hawkish surprise → dollar strengthens → gold priced higher in USD falls' },
    ],
    historicalMoves: [
      { ev: 'Fed Pivot Dec 2023', move: '+$80',  date: 'Dec 13 2023' },
      { ev: 'Rate Hike Cycle 2022', move: '-$380', date: 'Mar–Oct 2022' },
      { ev: 'COVID QE 2020',      move: '+$500', date: 'Mar–Aug 2020' },
    ],
    current: { label: 'Fed Rate', val: '5.25–5.50%', signal: '▲ BULLISH', signalColor: '#22C55E', note: 'Market pricing 2.3 cuts in 2024' },
  },
  {
    id: 't2', icon: '💵', iconBg: '#201800', name: 'US Dollar Index (DXY)',
    tagline: 'Direct inverse correlation r = −0.82. Daily impact on price.',
    impactLevel: 'HIGH', goldDir: 'bull',
    desc: "Gold is priced in US dollars, so there's a strong mechanical inverse relationship: when the dollar strengthens, gold becomes more expensive for foreign buyers (reducing demand), and vice versa. Every 1% change in DXY typically moves gold $15–$25 in the opposite direction.",
    mechanism: [
      { dir: '▲', text: 'DXY falls → gold cheaper for non-USD buyers → demand rises → price up' },
      { dir: '▲', text: 'USD weakness → investors seek alternative store of value → flows to gold' },
      { dir: '▼', text: 'DXY rises → gold expensive for international buyers → demand falls' },
      { dir: '▼', text: 'Strong dollar cycle → capital prefers USD assets over gold' },
    ],
    historicalMoves: [
      { ev: 'DXY 114 Peak 2022', move: '-$200', date: 'Sep 2022' },
      { ev: 'DXY 89 Low 2021',   move: '+$150', date: 'Jun 2021' },
      { ev: 'DXY Drop Mar 2024', move: '+$45',  date: 'Mar 2024' },
    ],
    current: { label: 'DXY Now', val: '104.23', signal: '▲ BULLISH', signalColor: '#22C55E', note: '−0.31 today; below 103.50 = gold challenges $2,360' },
  },
  {
    id: 't3', icon: '📈', iconBg: '#0D2018', name: 'Inflation Data (CPI / PCE / PPI)',
    tagline: 'Dual driver: hedge demand + rate cut expectations.',
    impactLevel: 'HIGH', goldDir: 'bull',
    desc: 'Inflation affects gold through two distinct channels. First, gold is a traditional inflation hedge. Second, and more powerfully in the current cycle, inflation readings affect Fed rate expectations. Soft CPI = sooner rate cuts = lower real yields = bullish gold.',
    mechanism: [
      { dir: '▲', text: 'CPI miss (lower than expected) → more rate cuts priced in → gold rallies' },
      { dir: '▲', text: 'Core PCE declining → Fed dovish → real yields fall → gold bid' },
      { dir: '▲', text: 'High inflation → real asset demand, currency debasement fear → gold store of value' },
      { dir: '▼', text: 'CPI beat (higher) → Fed delays cuts → real yields rise → gold sells off' },
    ],
    historicalMoves: [
      { ev: 'CPI Miss Oct 2023', move: '+$62', date: 'Nov 14 2023' },
      { ev: 'CPI Beat Feb 2024', move: '-$28', date: 'Feb 13 2024' },
      { ev: 'CPI Miss Jan 2024', move: '+$22', date: 'Jan 11 2024' },
    ],
    current: { label: 'US CPI', val: '3.5% (Mar)', signal: '▲ BULLISH', signalColor: '#22C55E', note: 'Forecast 3.4% for Apr — miss = gold surge Wed' },
  },
]

// ─── Week Events (View 1 Week tab) ────────────────────────────────────────────
export const mockWeekDays: WeekDay[] = [
  { day: 'MON', date: 'Apr 28', today: false, past: true, events: [
    { time: '09:30', name: 'Chinese Manufacturing PMI', country: 'CN', imp: 'MEDIUM',
      fore: '50.8', prev: '50.5', actual: '50.4',
      hist: 'Below 50 = China slowdown fear → mild safe haven bid +$5–$10',
      bull: { price: '$2,350', desc: 'Above 51: China demand optimism, mixed signal' },
      base: { price: '$2,335', desc: 'In-line: market ignores, gold unchanged' },
      bear: { price: '$2,320', desc: 'Below 50: risk-off spike, but fades' },
      histMoves: [{ ev: 'Jan 2024', move: '+$8',  outcome: 'Beat → mild' }, { ev: 'Nov 2023', move: '-$5',  outcome: 'Miss → muted' }, { ev: 'Aug 2023', move: '+$12', outcome: 'Sharp miss → bid' }] },
  ]},
  { day: 'TUE', date: 'Apr 29', today: false, past: true, events: [
    { time: '08:30', name: 'US Consumer Confidence', country: 'US', imp: 'LOW',
      fore: '98.5', prev: '97.0', actual: '98.2',
      hist: 'Low confidence = risk-off = mild gold support. Low direct impact.',
      bull: { price: '$2,348', desc: 'Sharp miss → safe haven flows' },
      base: { price: '$2,338', desc: 'In-line → no reaction' },
      bear: { price: '$2,325', desc: 'Beat → dollar strengthens' },
      histMoves: [{ ev: 'Mar 2024', move: '+$4', outcome: 'Miss' }, { ev: 'Feb 2024', move: '-$2', outcome: 'Beat' }, { ev: 'Jan 2024', move: '+$6', outcome: 'Sharp miss' }] },
  ]},
  { day: 'WED', date: 'Apr 30', today: true, past: false, events: [
    { time: '08:30', name: 'US CPI (YoY, Apr)', country: 'US', imp: 'HIGH',
      fore: '3.4%', prev: '3.5%', actual: null,
      hist: 'Single most important monthly data point for gold. Every 0.1% deviation = ~$15–$25 gold move.',
      bull: { price: '$2,380', desc: 'CPI ≤ 3.2%: major Fed cut re-pricing, dollar collapses' },
      base: { price: '$2,345', desc: 'CPI = 3.4%: in-line, modest relief rally' },
      bear: { price: '$2,295', desc: 'CPI ≥ 3.6%: rate cut hopes crushed, gold sell-off' },
      histMoves: [{ ev: 'Mar 2024', move: '+$38', outcome: 'CPI miss 3.2%' }, { ev: 'Feb 2024', move: '-$24', outcome: 'CPI beat 3.9%' }, { ev: 'Jan 2024', move: '+$18', outcome: 'CPI miss 3.1%' }] },
    { time: '10:00', name: 'Fed Chair Powell Speech', country: 'US', imp: 'HIGH',
      fore: 'N/A', prev: 'N/A', actual: null,
      hist: 'Powell tone is market-moving. Dovish = gold +$15–$40 in minutes. Hawkish = gold −$20–$50.',
      bull: { price: '$2,390', desc: 'Explicitly mentions cut timing → gold surges' },
      base: { price: '$2,350', desc: 'Data-dependent language, balanced tone' },
      bear: { price: '$2,290', desc: 'Pushes back on cuts, higher-for-longer' },
      histMoves: [{ ev: 'Mar 2024', move: '+$22', outcome: 'Dovish signal' }, { ev: 'Jan 2024', move: '-$18', outcome: 'Hawkish lean' }, { ev: 'Dec 2023', move: '+$45', outcome: 'Pivot signal' }] },
  ]},
  { day: 'THU', date: 'May 1', today: false, past: false, events: [
    { time: '08:30', name: 'US Initial Jobless Claims', country: 'US', imp: 'MEDIUM',
      fore: '212K', prev: '207K', actual: null,
      hist: 'Rising claims = weakening labor → bullish gold via Fed cut odds. High sensitivity when near Fed pivot.',
      bull: { price: '$2,365', desc: '>230K: labor weakening confirms cuts → gold rallies' },
      base: { price: '$2,345', desc: '210–215K: in-line, minimal reaction' },
      bear: { price: '$2,320', desc: '<200K: strong labor delays cuts, dollar bid' },
      histMoves: [{ ev: 'Apr W3', move: '+$9', outcome: 'Claims rose' }, { ev: 'Apr W2', move: '-$6', outcome: 'Claims fell' }, { ev: 'Mar W4', move: '+$14', outcome: 'Big rise' }] },
    { time: '08:30', name: 'US PPI (MoM, Apr)', country: 'US', imp: 'HIGH',
      fore: '0.3%', prev: '0.2%', actual: null,
      hist: 'PPI leads CPI. Soft PPI = inflation cooling = bullish gold via rate cut timeline.',
      bull: { price: '$2,370', desc: 'PPI ≤ 0.1%: inflation dying → cuts coming' },
      base: { price: '$2,345', desc: 'PPI = 0.3%: in-line, CPI confirms direction' },
      bear: { price: '$2,310', desc: 'PPI ≥ 0.5%: re-acceleration fears, gold hit' },
      histMoves: [{ ev: 'Mar 2024', move: '+$12', outcome: 'Soft 0.1%' }, { ev: 'Feb 2024', move: '-$8', outcome: 'Hot 0.6%' }, { ev: 'Jan 2024', move: '+$7', outcome: 'Soft 0.2%' }] },
  ]},
  { day: 'FRI', date: 'May 2', today: false, past: false, events: [
    { time: '08:30', name: 'US Non-Farm Payrolls (Apr)', country: 'US', imp: 'HIGH',
      fore: '+240K', prev: '+303K', actual: null,
      hist: 'Biggest monthly macro event. Strong NFP = strong dollar = gold sell-off. Weak NFP = rate cut hopes rise = gold rallies. Historical range: −$45 to +$60.',
      bull: { price: '$2,395', desc: 'NFP <150K: labor cracking, Fed cuts imminent' },
      base: { price: '$2,350', desc: 'NFP 220–260K: in-line, modest reaction' },
      bear: { price: '$2,285', desc: 'NFP >350K: cuts off the table, dollar surges' },
      histMoves: [{ ev: 'Mar 2024', move: '-$42', outcome: 'Blowout +303K' }, { ev: 'Feb 2024', move: '+$18', outcome: 'Below est 229K' }, { ev: 'Jan 2024', move: '-$35', outcome: 'Strong +256K' }] },
  ]},
]

// ─── Forecasts (View 1 Forecasts tab) ─────────────────────────────────────────
export const mockForecasts: ForecastRow[] = [
  { institution: 'JPMorgan Chase', sub: 'Commodities Research', price: 2500, bias: 'Bullish', upsidePct: 6.8, reason: 'Fed cuts + central bank demand structural', date: 'Q4 2024', tier: 1 },
  { institution: 'Goldman Sachs',  sub: 'Global Macro Research', price: 2700, bias: 'Bullish', upsidePct: 15.3, reason: 'Strong CB demand + ETF inflow reversal expected', date: 'Year-end 2024', tier: 1 },
  { institution: 'Citi',           sub: 'FX & Commodities',     price: 2400, bias: 'Bullish', upsidePct: 2.5, reason: 'Dollar softening; tactical long recommended', date: 'H2 2024', tier: 1 },
  { institution: 'UBS',            sub: 'Global Wealth Mgmt',   price: 2500, bias: 'Bullish', upsidePct: 6.8, reason: 'Diversification demand + geopolitical premium', date: 'End 2024', tier: 2 },
  { institution: 'Bank of America',sub: 'Global Research',      price: 2400, bias: 'Bullish', upsidePct: 2.5, reason: 'Inflation hedge demand + USD weakness cycle', date: 'Mid 2024', tier: 2 },
  { institution: 'Deutsche Bank',  sub: 'Commodities',          price: 2450, bias: 'Bullish', upsidePct: 4.6, reason: 'Yield curve normalisation = gold supportive', date: 'Q3 2024', tier: 2 },
  { institution: 'HSBC',           sub: 'Global Research',      price: 2300, bias: 'Neutral', upsidePct: -1.8, reason: 'Priced in; tactical neutral on near-term risks', date: 'H2 2024', tier: 3 },
  { institution: 'Morgan Stanley', sub: 'Global Strategy',      price: 2350, bias: 'Bullish', upsidePct: 0.4, reason: 'Rate cuts priced; needs new catalyst for breakout', date: 'Q4 2024', tier: 3 },
]
