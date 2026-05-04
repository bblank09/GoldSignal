# ◈ GoldSignal — AI-Powered Gold Trading Dashboard

> ระบบ Dashboard วิเคราะห์ทองคำ (XAU/USD) ระดับ Institutional-grade แบบ Real-time  
> · Next.js 14 · Supabase · Upstash Redis

---

## ⚡ Quick Start — ดูหน้า UI ได้ทันที (ไม่ต้องมี API key)

**Mac / Linux:**
```bash
git clone https://github.com/bblank09/GoldSignal.git
cd goldsignal
npm install
cp .env.local.example .env.local
npm run dev
```

**Windows (cmd.exe):**
```cmd
git clone https://github.com/bblank09/GoldSignal.git
cd goldsignal
npm install
copy .env.local.example .env.local
npm run dev
```

เปิด **http://localhost:3000** — จะเห็น Dashboard พร้อมข้อมูลจำลองทันที  
หากต้องการเปิดใช้ข้อมูลจริง → ดู [หัวข้อ 10 Live Mode](#10-วิธีใช้งาน--live-mode)

---

## 📋 สารบัญ

1. [บทนำและที่มา](#1-บทนำและที่มา)
2. [ความสำคัญและจุดประสงค์](#2-ความสำคัญและจุดประสงค์)
3. [ภาพรวมระบบ](#3-ภาพรวมระบบ)
4. [องค์ประกอบของระบบ](#4-องค์ประกอบของระบบ)
   - 4.1 [Frontend — UI Layer](#41-frontend--ui-layer)
   - 4.2 [Backend — API Layer](#42-backend--api-layer)
   - 4.3 [Data Pipeline — Cron Jobs](#43-data-pipeline--cron-jobs)
   - 4.4 [AI Analysis Engine](#44-ai-analysis-engine)
   - 4.5 [Database — Supabase](#45-database--supabase)
   - 4.6 [Cache — Upstash Redis](#46-cache--upstash-redis)
5. [แหล่งข้อมูลและความถี่](#5-แหล่งข้อมูลและความถี่)
6. [โครงสร้างไฟล์](#6-โครงสร้างไฟล์)
7. [ข้อกำหนดและ API Keys](#7-ข้อกำหนดและ-api-keys)
8. [วิธีติดตั้ง (Local Development)](#8-วิธีติดตั้ง-local-development)
9. [วิธีใช้งาน — Mock Mode](#9-วิธีใช้งาน--mock-mode)
10. [วิธีใช้งาน — Live Mode](#10-วิธีใช้งาน--live-mode)
11. [การ Deploy บน Vercel](#11-การ-deploy-บน-vercel)
12. [คู่มือการใช้งาน Dashboard](#12-คู่มือการใช้งาน-dashboard)
13. [ความเสี่ยงและข้อจำกัด](#13-ความเสี่ยงและข้อจำกัด)
14. [ข้อควรระวัง](#14-ข้อควรระวัง)
15. [การแก้ไขปัญหาเบื้องต้น](#15-การแก้ไขปัญหาเบื้องต้น)
16. [แนวทางพัฒนาต่อ](#16-แนวทางพัฒนาต่อ)

---

## 1. บทนำและที่มา

นักเทรดทองคำมักต้องเปิดหน้าต่างหลายจอพร้อมกันเพื่อรวบรวมข้อมูลที่ต้องการตัดสินใจ ได้แก่ กราฟราคาจาก TradingView, ข่าวจาก Forexlive หรือ Reuters, ดัชนี DXY จาก Bloomberg, อัตราผลตอบแทนพันธบัตร (Yields), VIX, ราคาน้ำมัน และอื่นๆ อีกมาก กระบวนการนี้กินเวลาและเกิดข้อผิดพลาดจากการตีความข้อมูลที่ไม่ครบถ้วนได้ง่าย

**GoldSignal** ถูกสร้างขึ้นเพื่อแก้ปัญหานี้ โดยเป็นระบบ Dashboard เพียงหน้าเดียวที่รวบรวม ประมวลผล และนำเสนอข้อมูลทุกอย่างที่ส่งผลต่อราคาทองคำ ผ่านการวิเคราะห์อัตโนมัติด้วย AI ตลอด 24 ชั่วโมง

---

## 2. ความสำคัญและจุดประสงค์

### ปัญหาที่แก้ไข

| ปัญหาเดิม | สิ่งที่ GoldSignal ทำ |
|---|---|
| ต้องเปิดหลายแท็บเพื่อรวบรวมข้อมูล | รวมทุกอย่างในหน้าเดียว |
| อ่านข่าวเองใช้เวลานาน | AI วิเคราะห์ข่าวและสรุปผลกระทบต่อราคาทองอัตโนมัติ |
| ต้องคอย refresh ด้วยตนเอง | ระบบอัปเดตข้อมูลทุก 5–30 นาที อัตโนมัติ |
| ไม่มีจุดเข้าซื้อ/ขายที่ชัดเจน | AI สร้าง Buy/Sell Zones พร้อม Stop Loss และ Target |
| ข้อมูล Macro กระจายหลายแหล่ง | ดึง DXY, Yields, VIX, SPX, Oil พร้อมบอกผลต่อทอง |

### จุดประสงค์หลัก

1. **Single Source of Truth** — รวมข้อมูล Technical + Fundamental + Sentiment ในที่เดียว
2. **AI-Driven Analysis** — ใช้ Claude AI อ่านข่าวและสรุปเป็นสัญญาณการเทรด
3. **Fully Autonomous** — Cron jobs ทำงานเองตลอดเวลา ผู้ใช้แค่เปิดมาดู

---

## 3. ภาพรวมระบบ

```
┌─────────────────────────────────────────────────────────────┐
│                    GoldSignal Architecture                   │
├─────────────────┬───────────────────────────────────────────┤
│   Data Sources  │  goldapi.io · Yahoo Finance · RSS Feeds   │
└────────┬────────┘                                           │
         │ fetch every 5–30 min (Vercel Cron)                 │
┌────────▼────────┐     ┌──────────────────┐                  │
│  Next.js API    │────▶│ Anthropic Claude  │ AI analysis      │
│  Route Handlers │     │ (claude-sonnet)   │                  │
└────────┬────────┘     └──────────────────┘                  │
         │                                                     │
    ┌────▼────┐    ┌──────────────┐                           │
    │ Supabase│    │ Upstash Redis│ ← price cache (10 min)    │
    │ (DB)    │    │ (Cache)      │                           │
    └────┬────┘    └──────┬───────┘                           │
         │                │                                    │
┌────────▼────────────────▼────────────────────────────────── │
│              Next.js Frontend (App Router)                   │
│  Feed Tab · Signals Tab · Chart Tab · Sidebar               │
│  SSE Price Stream · Lightweight Charts · Framer Motion       │
└─────────────────────────────────────────────────────────────┘
```

**Stack หลัก**

| ชั้น | เทคโนโลยี |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Tailwind CSS + shadcn/ui + Framer Motion |
| Chart | Lightweight Charts v4 (self-hosted, no TradingView) |
| AI | Anthropic Claude (`claude-sonnet-4-5`) |
| Database | Supabase (PostgreSQL + RLS) |
| Cache | Upstash Redis (REST API) |
| Deploy | Vercel (Serverless + Cron) |

---

## 4. องค์ประกอบของระบบ

### 4.1 Frontend — UI Layer

ระบบ UI แบ่งออกเป็น 3 แท็บหลักและ Sidebar ซ้ายมือ

#### Sidebar (แสดงตลอดเวลา)
- **GoldPriceTicker** — ราคา XAU/USD แบบ Real-time พร้อม Bid/Ask, Range bar
- **MacroBar** — ตาราง DXY · US10Y · US2Y · VIX · SPX · WTI พร้อมทิศทางผลต่อทอง
- **DailyBiasCard** — สรุปทิศทางวันนี้ (Bullish / Bearish / Neutral) พร้อม Strength bar
- **SentimentGauge** — สัดส่วน Bull/Bear/Neutral จากการวิเคราะห์ข่าวทั้งหมด
- **NewsCategoryList** — กรองข่าวตามหมวด (Fed, DXY, Inflation, Geopolitics ฯลฯ)

#### แท็บ Today (News Feed)
- แสดงข่าวที่ AI วิเคราะห์แล้ว เรียงตาม Impact Score
- แต่ละข่าวมี: Impact Badge, Sentiment Badge, Bull%, Expected Move
- กดขยายดู: AI Summary, Action Points, Bull/Base/Bear Scenarios, Key Levels, Source URL ↗

#### แท็บ Week (Economic Calendar)
- ปฏิทินเศรษฐกิจ 30 วันข้างหน้า
- แสดง Forecast, Previous, Actual (เมื่อประกาศแล้ว)
- สีตาม Importance: HIGH (แดง) · MEDIUM (เหลือง) · LOW (เทา)

#### แท็บ Taxonomy
- อธิบายปัจจัย 6 ตัวที่ขับเคลื่อนราคาทอง (Fed, DXY, Yields, Inflation, Geopolitics, Central Bank)
- แสดง Live reading จาก Macro snapshot
- แต่ละปัจจัยมี: กลไก ▲▼, Historical moves, Current signal

#### แท็บ Signals
- **Prediction Strip** — Target price ทุก timeframe (4H, 1D, 1W, 1M, 3M, 6M, 12M)
- **Buy/Sell Zone Panels** — แนวรับ-แนวต้าน พร้อม Stop Loss, Target, Confidence
- **Weekly Outlook** — สรุปมุมมองสัปดาห์ พร้อม Key Events
- **Risk Factors** — ปัจจัยสนับสนุน vs ปัจจัยเสี่ยง

#### แท็บ Chart
- Candlestick chart จากข้อมูล OHLCV จริง (Yahoo Finance `GC=F`)
- **AI Support/Resistance lines** — เส้นแนวรับ/แนวต้านที่ดึงมาจาก `article_analysis.key_levels` ทุกบทความ
- **Buy/Sell zone lines** — เส้นหนาจาก daily signal (ไม่ใช่ indicator)
- **News markers** — ▲▼ บน candle วันที่มีข่าว High Impact
- Volume histogram ด้านล่าง
- Timeframe: 15m · 1H · 4H · 1D · 1W

---

### 4.2 Backend — API Layer

| Endpoint | หน้าที่ | Cache |
|---|---|---|
| `GET /api/price` | ราคาทองล่าสุด (Redis → DB) | Redis 10 นาที |
| `GET /api/price/stream` | SSE stream ราคา real-time ทุก 10 วินาที | — |
| `GET /api/macro` | Macro snapshot (Redis → DB → Live fetch) | Redis 6 นาที |
| `GET /api/news` | บทความพร้อม AI analysis | — |
| `GET /api/news/[id]/analysis` | Analysis ของบทความเดี่ยว | — |
| `GET /api/signal/daily` | Daily signal ประจำวัน | — |
| `GET /api/calendar` | Economic events (DB → Seed fallback) | — |
| `GET /api/chart/candles` | OHLCV candles จาก Yahoo Finance | Redis 5 นาที |

---

### 4.3 Data Pipeline — Cron Jobs

| Endpoint | หน้าที่ | ความถี่ |
|---|---|---|
| `/api/cron/price-tick` | ดึงราคาทอง → บันทึก DB + Redis | ทุก 5 นาที |
| `/api/cron/macro-snapshot` | ดึง DXY/Yields/VIX → บันทึก DB + Redis | ทุก 15 นาที |
| `/api/cron/fetch-news` | ดึงข่าว RSS 6 แหล่ง → บันทึก DB | ทุก 30 นาที |
| `/api/cron/analyze-news` | ส่งข่าวให้ Claude วิเคราะห์ (batch 5) | ทุก 30 นาที |
| `/api/cron/daily-signal` | Claude สังเคราะห์ signal ประจำวัน | 06:00 UTC ทุกวัน |
| `/api/cron/calendar-sync` | อัปเดต economic calendar | ทุกวันจันทร์ |

ทุก cron ต้องใช้ Bearer token (`CRON_SECRET`) ในการเรียก

---

### 4.4 AI Analysis Engine

**Article Analysis** (`/lib/services/news-analyzer.ts`)

Claude รับบทความแต่ละชิ้นและคืน JSON ที่มี:

```
sentiment        → Bullish / Bearish / Neutral
impact_score     → 0–10 (8–10 = HIGH, 5–7 = MEDIUM, 0–4 = LOW)
impact_level     → HIGH / MEDIUM / LOW
key_levels       → { support: [price1, price2], resistance: [price1, price2] }
summary          → อธิบาย WHY ข่าวนี้ส่งผลต่อทอง (2–4 ประโยค)
action_points    → คำแนะนำการเทรดที่เฉพาะเจาะจง (1–3 ประโยค)
bull_case        → { price, description } เป้าหมายถ้าเกิด Bullish scenario
base_case        → { price, description } เป้าหมายกรณีปกติ
bear_case        → { price, description } เป้าหมายถ้าเกิด Bearish scenario
prob_bull        → ความน่าจะเป็น Bullish (0.00–1.00)
expected_move    → ช่วงราคาที่คาดว่าจะเคลื่อนไหว เช่น "+$15–$25"
confidence       → ความมั่นใจในการวิเคราะห์ (0.00–1.00)
```

**Daily Signal Synthesis** (`/lib/services/daily-signal.ts`)

Claude รับบทความ 10 ชิ้นที่มี Impact สูงสุด + Macro snapshot แล้วสังเคราะห์:

```
bias             → Bullish / Bearish / Neutral
strength         → 1–5 (5 = high conviction)
buy_zones[]      → แนวรับ พร้อม stop_loss, target, confidence, reason
sell_zones[]     → แนวต้าน พร้อม stop_loss, target, confidence, reason
weekly_outlook   → สรุปมุมมองสัปดาห์ (2–3 ย่อหน้า)
supporting_factors[] → ปัจจัยสนับสนุนทิศทาง
risk_factors[]   → ปัจจัยเสี่ยงที่อาจพลิกทิศทาง
executive_summary → สรุปใน 1 ประโยค
```

---

### 4.5 Database — Supabase

**ตารางหลัก 6 ตาราง**

| ตาราง | เก็บอะไร |
|---|---|
| `articles` | บทความข่าวจาก RSS พร้อม URL ต้นฉบับ |
| `article_analysis` | ผลการวิเคราะห์ AI ของแต่ละบทความ |
| `price_ticks` | ราคาทองทุก 5 นาที (OHLC, Bid/Ask, Source) |
| `macro_snapshots` | Macro data snapshot ทุก 15 นาที |
| `daily_signals` | AI Signal สรุปรายวัน (1 แถว/วัน) |
| `economic_events` | ปฏิทินเศรษฐกิจ (upsert จาก seed + live API) |

ทุกตารางมี **Row Level Security (RLS)** — อ่านได้ผ่าน anon key, เขียนได้เฉพาะ service role (cron jobs)

---

### 4.6 Cache — Upstash Redis

| Key | เก็บอะไร | TTL |
|---|---|---|
| `gs:price:current` | GoldPrice JSON ล่าสุด | 10 นาที |
| `gs:macro:current` | MacroSnapshot JSON ล่าสุด | 6 นาที |
| `gs:chart:candles:1d` | OHLCV candles รายวัน | 5 นาที |
| `gs:chart:candles:60m` | OHLCV candles รายชั่วโมง | 5 นาที |
| `gs:chart:candles:15m` | OHLCV candles 15 นาที | 5 นาที |

Redis ทำหน้าที่ลด latency และลดจำนวนการเรียก Yahoo Finance / Supabase

---

## 5. แหล่งข้อมูลและความถี่

### แหล่งราคา

| แหล่ง | API | ความถี่ | หมายเหตุ |
|---|---|---|---|
| goldapi.io | `goldapi.io/api/XAU/USD` | ทุก 5 นาที | Primary (จำกัด ~500 req/เดือน free) |
| Yahoo Finance | `query1.finance.yahoo.com` `GC=F` | Fallback อัตโนมัติ | ใช้เมื่อ GoldAPI หมด quota |

### แหล่ง Macro

| ข้อมูล | Symbol Yahoo | ดึงทุก |
|---|---|---|
| US Dollar Index | `DX-Y.NYB` | 15 นาที |
| US 10Y Treasury Yield | `^TNX` | 15 นาที |
| US 2Y Treasury Yield | `^IRX` | 15 นาที |
| VIX Fear Index | `^VIX` | 15 นาที |
| S&P 500 | `^GSPC` | 15 นาที |
| WTI Crude Oil | `CL=F` | 15 นาที |

### แหล่งข่าว (RSS)

| แหล่ง | URL | หมวดหลัก |
|---|---|---|
| Reuters | `feeds.reuters.com/reuters/businessNews` | Macro, Economy |
| Kitco | `feeds.kitco.com/MarketNuggets` | Gold Technical |
| MarketWatch | `marketwatch.com/rss/topstories` | US Markets |
| Yahoo Finance | `finance.yahoo.com/rss/topfinstories` | Finance |
| Investing.com | `investing.com/rss/news_25.rss` | Fed, Central Bank |
| ForexLive | `forexlive.com/feed/news` | USD, DXY, FX |

ระบบกรองเฉพาะข่าวที่มี keyword เกี่ยวกับทอง เช่น gold, xau, fed rate, cpi, dxy, treasury, safe haven, pboc, bullion ฯลฯ

---

## 6. โครงสร้างไฟล์

```
goldsignal/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Server Component: ดึง price/macro/signal
│   │   ├── page.tsx            ← Feed: Today/Week/Taxonomy/Forecasts tabs
│   │   ├── signals/page.tsx    ← Signals: Buy/Sell zones + Calendar
│   │   └── chart/page.tsx      ← Chart: GoldChart + Controls
│   └── api/
│       ├── price/
│       │   ├── route.ts        ← GET price (Redis → DB → Live)
│       │   └── stream/route.ts ← SSE real-time stream ทุก 10s
│       ├── macro/route.ts      ← GET macro (Redis → DB → Live fetch)
│       ├── news/route.ts       ← GET articles with analysis
│       ├── signal/daily/route.ts
│       ├── calendar/route.ts   ← GET events (DB → Seed fallback)
│       ├── chart/candles/route.ts ← GET OHLCV from Yahoo Finance
│       └── cron/               ← 6 cron routes (ต้องใช้ Bearer token)
│
├── components/
│   ├── layout/                 ← Topbar, Sidebar
│   ├── news/                   ← NewsCard, NewsFeed, FilterBar, WeekTimeline,
│   │                              TaxonomyList, ForecastsTable
│   ├── signals/                ← PredictionStrip, ZonePanel, StatCard,
│   │                              WeeklyOutlook, RiskFactors, EconomicCalendar
│   ├── chart/                  ← GoldChart (Lightweight Charts v4),
│   │                              ChartControls, NewsTimeline
│   └── ui/                     ← ImpactBadge, SentimentBadge, BiasBadge,
│                                  StrengthBars, ConfidenceBar, FactorTag
│
├── lib/
│   ├── anthropic.ts            ← Claude client + retry helper
│   ├── redis.ts                ← Upstash Redis lazy proxy
│   ├── types.ts                ← TypeScript types ทั้งระบบ
│   ├── format.ts               ← formatPrice, formatTimeAgo ฯลฯ
│   ├── mock-data.ts            ← ข้อมูลจำลองสำหรับ dev/testing
│   ├── build-taxonomy.ts       ← สร้าง TaxonomyEntry[] จาก MacroSnapshot
│   ├── build-predictions.ts    ← สร้าง Prediction[] จาก DailySignal
│   ├── hooks/
│   │   ├── use-price-stream.ts ← SSE hook พร้อม exponential backoff retry
│   │   └── use-news.ts         ← fetch news hook
│   ├── services/
│   │   ├── price.ts            ← fetchGoldPrice (goldapi → yahoo fallback)
│   │   ├── macro.ts            ← fetchMacroSnapshot (6 Yahoo symbols)
│   │   ├── news-fetcher.ts     ← RSS aggregator + gold-relevance filter
│   │   ├── news-analyzer.ts    ← Claude article analysis batch
│   │   ├── daily-signal.ts     ← Claude daily synthesis
│   │   └── calendar.ts         ← Economic calendar + seed events
│   ├── prompts/
│   │   ├── analyze-article.ts  ← Claude prompt สำหรับวิเคราะห์บทความ
│   │   └── daily-synthesis.ts  ← Claude prompt สำหรับ signal รายวัน
│   ├── store/ui-store.ts       ← Zustand store (filter, expanded card ฯลฯ)
│   └── supabase/
│       ├── client.ts           ← Browser client
│       ├── server.ts           ← Server Component client
│       └── admin.ts            ← Service role client (cron only)
│
├── supabase/
│   └── schema.sql              ← DDL: ตาราง + index + RLS policies
│
├── vercel.json                 ← Cron schedules
├── middleware.ts               ← Inject x-pathname header
└── .env.local.example          ← Template env vars
```

---

## 7. ข้อกำหนดและ API Keys

### สิ่งที่ต้องมีก่อน

| รายการ | ที่ไหน | ฟรีหรือไม่ |
|---|---|---|
| Node.js 18+ | [nodejs.org](https://nodejs.org) | ✅ ฟรี |
| Supabase Project | [supabase.com](https://supabase.com) | ✅ Free tier |
| Upstash Redis | [console.upstash.com](https://console.upstash.com) | ✅ Free tier |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com) | 💰 Pay-per-use |
| GoldAPI Key | [goldapi.io](https://www.goldapi.io) | ✅ Free (500 req/เดือน) |

### Environment Variables

```bash
# Supabase — Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Upstash Redis — Database → REST API
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# GoldAPI (optional — Yahoo Finance ใช้เป็น fallback ถ้าไม่มี)
GOLDAPI_KEY=goldapi-...

# Cron Security — ดูวิธีสร้างด้านล่าง
CRON_SECRET=my-super-secret-cron-key

# App URL (ใช้ตอน deploy จริง)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### วิธีสร้าง CRON_SECRET

`CRON_SECRET` คือรหัสลับที่คุณตั้งเองเพื่อป้องกันคนอื่นเรียก Cron endpoints  
เลือกวิธีสร้างตามระบบที่ใช้:

**Mac / Linux (Terminal):**
```bash
openssl rand -hex 32
# ตัวอย่างผลลัพธ์: a3f8c2e1b4d7901234567890abcdef1234567890abcdef1234567890abcdef12
```

**Windows (PowerShell):**
```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
# ตัวอย่างผลลัพธ์: a3f8c2e1b4d790123456789abcdef1234567890abcdef1234567890abcdef12
```

**วิธีง่ายที่สุด (ทุกระบบ):**  
ไปที่ https://generate-secret.vercel.app/32 → copy ค่าที่ได้มาใส่ใน `.env.local`

> ค่านี้ตั้งอะไรก็ได้ ขอแค่จำได้และไม่ใช่คำง่ายๆ เช่น `password` หรือ `123456`  
> ใช้ค่าเดียวกันนี้ตลอด — ทั้งใน `.env.local` และในคำสั่ง curl ด้านล่าง

---

## 8. วิธีติดตั้ง (Local Development)

### ขั้นตอนที่ 1 — Clone และติดตั้ง

```bash
git clone https://github.com/bblank09/GoldSignal.git
cd GoldSignal/goldsignal
npm install
```

### ขั้นตอนที่ 2 — ตั้งค่า Environment

**Mac / Linux:**
```bash
cp .env.local.example .env.local
```

**Windows (cmd.exe):**
```cmd
copy .env.local.example .env.local
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.local.example .env.local
```

> **ค่าเริ่มต้นคือ Mock Mode** — ไฟล์ `.env.local` ที่ copy มามีค่า `DATA_MODE=mock` อยู่แล้ว  
> ไม่จำเป็นต้องกรอก API key ใดๆ เพื่อรันครั้งแรก

### ขั้นตอนที่ 3 — รัน Dev Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) — จะเห็น Dashboard พร้อม **ข้อมูลจำลอง** ทันที  
มี badge `◎ MOCK` แสดงที่ Topbar เพื่อบอกว่ากำลังใช้ Mock Mode

> **ต้องการ Live Mode?** — ดูหัวข้อ 10 สำหรับการตั้งค่า Supabase, Redis, และ API keys ครบ

### ขั้นตอนที่ 4 (เฉพาะ Live Mode) — ตั้งค่า Supabase Database

หากต้องการใช้ข้อมูลจริง:
1. เข้า [Supabase Dashboard](https://supabase.com/dashboard) → เลือก Project
2. ไปที่ **SQL Editor**
3. Copy ทั้งหมดจากไฟล์ `supabase/schema.sql` แล้ว Paste และ Run
4. ตรวจสอบว่าสร้างตารางครบ 6 ตาราง: `articles`, `article_analysis`, `price_ticks`, `macro_snapshots`, `daily_signals`, `economic_events`

---

## 9. วิธีใช้งาน — Mock Mode

Mock Mode คือโหมดเริ่มต้น (**default**) — ใช้ **ข้อมูลจำลอง** จาก `lib/mock-data.ts`  
ไม่ต้องการ API key ใดๆ เหมาะสำหรับการดูหน้าตา UI, พัฒนา feature ใหม่, หรือแชร์ demo

### วิธีรัน Mock Mode

```bash
# ตรวจสอบว่า .env.local มีค่านี้ (ค่าเริ่มต้นที่ copy มาจาก example แล้ว)
DATA_MODE=mock
NEXT_PUBLIC_DATA_SOURCE=mock
```

```bash
npm run dev
# → เปิด http://localhost:3000
# → จะเห็น badge "◎ MOCK" ที่ Topbar แสดงว่ากำลังใช้ Mock Mode
```

### ข้อมูลจำลองที่มีให้

| ข้อมูล | ค่า |
|---|---|
| ราคาทอง | $2,341.50 (มี SSE simulation — ราคาขยับสุ่มทุก 10 วินาที) |
| Macro | DXY 104.23, US10Y 4.28%, VIX 18.50, SPX 4,850 |
| บทความข่าว | 5 บทความพร้อม AI analysis ครบทุก field |
| Daily Signal | Bullish, strength 4/5, Buy/Sell zones พร้อม Stop Loss |
| Economic Calendar | 6 events (May 14–23) |
| Forecasts | Mock institutional forecasts จาก 5 สถาบัน |

> Mock Mode ดูสมจริง — SSE ราคา simulate การเคลื่อนไหว, Filter/Tab ทุกอย่างทำงานได้  
> ข้อมูลเดียวกันทุกครั้งที่เปิด (ไม่ใช่ข้อมูลตลาดจริง)

---

## 10. วิธีใช้งาน — Live Mode

Live Mode ดึงข้อมูลจริงจาก Yahoo Finance, Supabase, Redis และวิเคราะห์ด้วย Claude AI  
ต้องการ API keys และการตั้งค่าเพิ่มเติมก่อนใช้งาน

### ขั้นตอนที่ 1 — เปิดใช้ Live Mode ใน .env.local

แก้ไขไฟล์ `.env.local` — เปลี่ยนจาก `mock` เป็น `live` และกรอก API keys ทุกตัว:

```bash
# เปลี่ยน mock → live
DATA_MODE=live
NEXT_PUBLIC_DATA_SOURCE=live

# กรอก keys ทุกตัวจากหัวข้อ 7
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...
ANTHROPIC_API_KEY=sk-ant-...
CRON_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ขั้นตอนที่ 2 — รัน Dev Server

```bash
npm run dev
```

### ขั้นตอนที่ 3 — Seed ข้อมูลเริ่มต้น (รัน Cron ด้วยมือ)

แทนที่ `YOUR_SECRET` ด้วยค่า `CRON_SECRET` ที่ตั้งไว้ใน `.env.local`  
เลือกรันตามระบบที่ใช้:

---

#### Mac / Linux (Terminal)

```bash
# 1. ดึงราคาทองล่าสุด
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/price-tick

# 2. ดึงข้อมูล Macro (DXY, Yields, VIX ฯลฯ)
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/macro-snapshot

# 3. Seed ปฏิทินเศรษฐกิจ
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/calendar-sync

# 4. ดึงข่าว RSS จาก 6 แหล่ง
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/fetch-news

# 5. ให้ AI วิเคราะห์ข่าว (รอ 30–60 วินาที)
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/analyze-news

# 6. สร้าง Daily Signal (รอ 30–60 วินาที)
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/daily-signal
```

---

#### Windows — Command Prompt (cmd.exe)

```cmd
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/price-tick
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/macro-snapshot
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/calendar-sync
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/fetch-news
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/analyze-news
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/daily-signal
```

> `curl` มาพร้อม Windows 10/11 แล้ว ไม่ต้องติดตั้งเพิ่ม

---

#### Windows — PowerShell

```powershell
$secret = "YOUR_SECRET"
$base   = "http://localhost:3000/api/cron"
$headers = @{ Authorization = "Bearer $secret" }

Invoke-RestMethod "$base/price-tick"     -Headers $headers
Invoke-RestMethod "$base/macro-snapshot" -Headers $headers
Invoke-RestMethod "$base/calendar-sync"  -Headers $headers
Invoke-RestMethod "$base/fetch-news"     -Headers $headers
Invoke-RestMethod "$base/analyze-news"   -Headers $headers   # รอ 30–60 วินาที
Invoke-RestMethod "$base/daily-signal"   -Headers $headers   # รอ 30–60 วินาที
```

> แนะนำให้รันทีละบรรทัด อย่ารวดเดียวทั้งหมด — รอดูผลลัพธ์ก่อนไปบรรทัดถัดไป

> **หมายเหตุ:** ขั้นตอน 5–6 ใช้ Anthropic API ซึ่งมีค่าใช้จ่ายตาม token  
> ดูราคาได้ที่ [anthropic.com/pricing](https://www.anthropic.com/pricing)

---

### ขั้นตอนที่ 4 — ตรวจสอบว่าข้อมูลเข้า

**Mac / Linux:**
```bash
curl http://localhost:3000/api/price
curl http://localhost:3000/api/news
curl http://localhost:3000/api/signal/daily
```

**Windows (cmd หรือ PowerShell):**
```cmd
curl http://localhost:3000/api/price
curl http://localhost:3000/api/news
curl http://localhost:3000/api/signal/daily
```

เปิด [http://localhost:3000](http://localhost:3000) — ควรเห็นข้อมูลจริงแล้ว  
Topbar จะไม่แสดง `◎ MOCK` อีกต่อไป

---

## 11. การ Deploy บน Vercel

### ขั้นตอนที่ 1 — Push โค้ดขึ้น GitHub

```bash
git add .
git commit -m "deploy goldsignal"
git push origin main
```

### ขั้นตอนที่ 2 — Connect Vercel

1. ไปที่ [vercel.com](https://vercel.com) → Import Project จาก GitHub
2. เลือก repo และ root directory เป็น `goldsignal`

### ขั้นตอนที่ 3 — ตั้งค่า Environment Variables

ไปที่ **Settings → Environment Variables** แล้วเพิ่มทุกตัวจาก `.env.local`:

```
DATA_MODE=live                                      ← ต้องตั้งเป็น live บน Vercel
NEXT_PUBLIC_DATA_SOURCE=live
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app    ← เปลี่ยนเป็น URL จริง
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
ANTHROPIC_API_KEY=...
CRON_SECRET=...
```

> ⚠️ หากไม่ตั้ง `DATA_MODE=live` บน Vercel — production จะแสดงเฉพาะ mock data

### ขั้นตอนที่ 4 — Deploy

```bash
npx vercel --prod
```

### Cron Jobs บน Vercel

`vercel.json` กำหนด schedule ไว้แล้ว:

| Cron | Schedule | เวลาไทย (UTC+7) |
|---|---|---|
| price-tick | ทุก 5 นาที | ตลอดเวลา |
| macro-snapshot | ทุก 15 นาที | ตลอดเวลา |
| fetch-news | ทุก 30 นาที | ตลอดเวลา |
| analyze-news | ทุก 30 นาที | ตลอดเวลา |
| daily-signal | 06:00 UTC | 13:00 น. |
| calendar-sync | ทุกวันจันทร์ 00:00 UTC | จ. 07:00 น. |

> **หมายเหตุ Vercel:** Hobby plan รองรับ Cron ได้ 1 job เท่านั้น  
> ต้องการ Cron ครบต้องอัปเกรดเป็น **Pro plan ($20/เดือน)**

---

## 12. คู่มือการใช้งาน Dashboard

### Sidebar — อ่านข้อมูลสำคัญ

```
┌─────────────────────────────┐
│ XAU/USD  $3,342.50          │ ← ราคาปัจจุบัน (real-time SSE)
│ ▲ +12.30 (+0.37%)          │ ← เปลี่ยนแปลงวันนี้
│ Bid 3342.10 · Ask 3342.90  │
│ ████████████░░░░░│          │ ← Day range bar
│                              │
│ DXY      104.2  ↓ -0.3  🟢 │ ← ↓ DXY = bullish for gold
│ US10Y    4.28%  ↑ +0.02 🔴 │ ← ↑ Yields = bearish for gold
│ VIX      18.5   ↑ +1.2  🟡 │
│                              │
│ ◉ BULLISH ████░  str: 4/5  │ ← AI Daily Bias
│ 68% Bull · 20% Bear · 12%N │ ← Sentiment จากข่าว
└─────────────────────────────┘
```

### แท็บ Today — อ่านข่าว

1. กรองข่าวด้วย Filter Bar: `All` / `High Impact` / `Bullish` / `Bearish`
2. กรองตาม Category จาก Sidebar: Fed, DXY, Inflation ฯลฯ
3. คลิกการ์ดข่าวเพื่อขยาย → ดู AI Summary, Action Points, Scenarios
4. คลิก **↗** ข้างชื่อแหล่งข่าวเพื่อเปิดบทความต้นฉบับ

### แท็บ Signals — ใช้วางแผนการเทรด

1. ดู **Daily Bias** — ทิศทางโดยรวมวันนี้
2. อ่าน **Buy Zones** — ราคาแนวรับ, Stop Loss, Target
3. อ่าน **Sell Zones** — ราคาแนวต้าน, Stop Loss, Target  
4. อ่าน **Weekly Outlook** — สรุปสัปดาห์และ Key Events
5. ตรวจ **Economic Calendar** — วัน/เวลาประกาศข้อมูลสำคัญ

### แท็บ Chart — ดูกราฟ

1. เลือก Timeframe: 15m / 1H / 4H / 1D / 1W
2. เส้น **AI Support** (เขียวจาง) — แนวรับจากบทความวิเคราะห์
3. เส้น **AI Resistance** (แดงจาง) — แนวต้านจากบทความวิเคราะห์
4. เส้นหนา **BUY ZONE** (เขียวเข้ม) — จาก Daily Signal
5. เส้นหนา **SELL ZONE** (แดงเข้ม) — จาก Daily Signal
6. ▲▼ markers บน candle — ข่าวที่มีผลกระทบในวันนั้น

---

## 13. ความเสี่ยงและข้อจำกัด

### ด้านข้อมูล

| ความเสี่ยง | รายละเอียด | ผลกระทบ |
|---|---|---|
| **GoldAPI Quota** | Free tier จำกัด ~500 req/เดือน ≈ 16 req/วัน | ราคาใช้ Yahoo fallback อัตโนมัติ |
| **Yahoo Finance Blocking** | Yahoo อาจบล็อก request ที่ถี่เกินไป | ราคาอาจขาดหายช่วงสั้นๆ |
| **RSS Feed Outage** | แหล่งข่าวบางแหล่งอาจหยุดให้บริการชั่วคราว | จำนวนข่าวลดลง |
| **Macro Data Delay** | Yahoo Finance อาจ delay สูงสุด 15 นาที | Macro อาจไม่ตรง real-time 100% |

### ด้าน AI

| ความเสี่ยง | รายละเอียด |
|---|---|
| **AI Hallucination** | Claude อาจวิเคราะห์ราคาหรือสถานการณ์ผิดพลาดได้ |
| **Prompt Engineering** | ผลลัพธ์ขึ้นกับ prompt — การเปลี่ยน prompt ส่งผลต่อคุณภาพ |
| **Context Window** | บทความที่ยาวมากอาจถูกตัดออก |
| **API Cost** | ราคาเปลี่ยนตาม token ที่ใช้ — ควรตั้ง budget limit |

### ด้านการเงิน

> ⚠️ **คำเตือนสำคัญ**  
> GoldSignal เป็นเครื่องมือวิเคราะห์ข้อมูล **ไม่ใช่คำแนะนำทางการเงิน**  
> ผลการวิเคราะห์ของ AI อาจผิดพลาดได้และไม่รับประกันผลกำไร  
> การตัดสินใจเทรดทุกครั้งเป็นความรับผิดชอบของผู้ใช้แต่เพียงผู้เดียว

---

## 14. ข้อควรระวัง

### 🔐 ด้านความปลอดภัย

```
✗ ห้าม commit ไฟล์ .env.local ขึ้น Git
✗ ห้าม expose SUPABASE_SERVICE_ROLE_KEY ฝั่ง client
✗ ห้าม share CRON_SECRET ในที่สาธารณะ
✓ ตรวจสอบว่า .gitignore มี .env.local อยู่แล้ว
✓ ใช้ Vercel Environment Variables สำหรับ production
```

### 💰 ด้านค่าใช้จ่าย API

```
Anthropic Claude:
  - Article analysis: ~$0.001–0.003 ต่อบทความ
  - Daily signal:     ~$0.01–0.03 ต่อครั้ง
  - ต่อวัน (ข่าว 10 ชิ้น + 1 signal): ~$0.02–0.05
  - ต่อเดือน: ~$0.60–1.50 USD (ไม่รวมค่า prompt caching)
  → แนะนำตั้ง Usage Limit บน console.anthropic.com

GoldAPI:
  - Free: 500 req/เดือน (เพียงพอสำหรับ local dev)
  - Paid: $9.99/เดือน สำหรับ production จริง

Vercel:
  - Hobby: ฟรี (Cron 1 job)
  - Pro: $20/เดือน (Cron ไม่จำกัด)
```

### ⚡ ด้านประสิทธิภาพ

```
✓ ไม่ควรรัน analyze-news บ่อยกว่า 30 นาที — Claude มีค่าใช้จ่าย
✓ Redis TTL ตั้งไว้เหมาะสมแล้ว — ห้ามลด TTL โดยไม่จำเป็น
✓ กราฟ OHLCV cache 5 นาที — ไม่ต้องดึง Yahoo Finance ทุก request
✗ ห้ามเรียก Cron endpoints โดยตรงจาก client ที่ไม่มี auth
```

### 🔄 ด้านข้อมูล

```
✓ Daily Signal รัน 1 ครั้ง/วัน ที่ 13:00 น. (ไทย) — ข้อมูลตรงกับตลาดเปิด US
✓ ข่าวที่วิเคราะห์แล้วจะไม่วิเคราะห์ซ้ำ (check article_analysis)
✗ อย่ากรอกข้อมูลทดสอบลง Supabase production — ใช้ local dev แยก
✓ Calendar Seed events มีให้ครบถึงสิ้นเดือน — ไม่ต้องรัน calendar-sync ก่อน
```

---

## 15. การแก้ไขปัญหาเบื้องต้น

### ปัญหา: หน้า Signals ขึ้น "Loading signals..."

**สาเหตุ:** ยังไม่มี Daily Signal ในวันนี้

**Mac/Linux:**
```bash
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/daily-signal
```
**Windows (cmd):**
```cmd
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/daily-signal
```
**Windows (PowerShell):**
```powershell
Invoke-RestMethod "http://localhost:3000/api/cron/daily-signal" -Headers @{ Authorization = "Bearer YOUR_SECRET" }
```

---

### ปัญหา: ข่าวในแท็บ Today ว่างเปล่า

**สาเหตุ:** ยังไม่ได้รัน fetch-news และ analyze-news

**Mac/Linux:**
```bash
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/fetch-news
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/analyze-news
```
**Windows (cmd):**
```cmd
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/fetch-news
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/analyze-news
```

---

### ปัญหา: กราฟไม่แสดง candles

**สาเหตุ:** Lightweight Charts ยังโหลดจาก CDN ไม่เสร็จ หรือ Yahoo Finance ถูก block  
**แก้:**
1. รอ 5–10 วินาที แล้ว refresh
2. ตรวจสอบ Network tab ใน DevTools ว่า `/api/chart/candles` คืนข้อมูลหรือไม่

---

### ปัญหา: Taxonomy แสดง `--` ทุกช่อง

**สาเหตุ:** Macro data ยังไม่โหลด  
**แก้:** `/api/macro` จะ live-fetch อัตโนมัติ รอ 5–10 วินาที แล้วเปิดแท็บ Taxonomy ใหม่

---

### ปัญหา: `CRON_SECRET` ไม่ผ่าน (401 Unauthorized)

**แก้:** ตรวจสอบว่า value ใน `.env.local` ตรงกับที่ใส่ใน curl/PowerShell ทุกตัวอักษร  
ไม่มีช่องว่าง ไม่มีเครื่องหมาย quote รอบๆ ค่า

---

### ปัญหา: Windows — `'cp' is not recognized`

**สาเหตุ:** cmd.exe ไม่มีคำสั่ง `cp`  
**แก้:** ใช้ `copy` แทน
```cmd
copy .env.local.example .env.local
```

---

### ปัญหา: Windows — PowerShell แสดง error `Invoke-RestMethod ... SSL`

**สาเหตุ:** localhost ไม่มี SSL certificate  
**แก้:** เพิ่ม `-SkipCertificateCheck` (PowerShell 7+) หรือใช้ cmd + curl แทน
```powershell
Invoke-RestMethod "http://localhost:3000/api/cron/price-tick" -Headers @{ Authorization = "Bearer YOUR_SECRET" } -SkipCertificateCheck
```

---

### ปัญหา: Build fail ด้วย TypeScript error

```bash
npm run build 2>&1 | grep "Type error"
```

ส่วนใหญ่เกิดจากการแก้ไขไฟล์ type ไม่ตรง — ห้ามแก้ `lib/types.ts` โดยไม่อัปเดต component ที่ใช้งาน

---

## 16. แนวทางพัฒนาต่อ

### ฟีเจอร์ที่อาจเพิ่มในอนาคต

| ฟีเจอร์ | รายละเอียด | ความยาก |
|---|---|---|
| **Alert System** | แจ้งเตือนเมื่อราคาถึง Buy/Sell Zone | ⭐⭐ |
| **Trade Journal** | บันทึกการเทรดและเปรียบเทียบกับ Signal | ⭐⭐ |
| **Multi-Asset** | ขยายไปครอบ Silver (XAG), Bitcoin (BTC) | ⭐⭐⭐ |
| **Docker Mode** | รัน PostgreSQL + Redis บน Docker แทน cloud | ⭐⭐ |
| **Live Economic Data** | ดึง calendar จาก Investing.com API แทน seed | ⭐⭐⭐ |
| **Backtesting** | ทดสอบ signal ย้อนหลัง 6–12 เดือน | ⭐⭐⭐⭐ |
| **Mobile App** | React Native version | ⭐⭐⭐⭐⭐ |

### การเปลี่ยนไปใช้ Docker (สำหรับผู้ไม่ต้องการ cloud services)

หากไม่ต้องการใช้ Supabase + Upstash สามารถเปลี่ยนเป็น:
- **PostgreSQL** container แทน Supabase
- **Redis** container แทน Upstash Redis
- **node-cron** ใน app แทน Vercel Cron
- Deploy บน Railway / Fly.io / VPS แทน Vercel

การเปลี่ยนต้องแก้ไข database client (`lib/supabase/*`) และ Redis client (`lib/redis.ts`) ใช้เวลาประมาณ 1–2 วัน

---

## License

MIT License — ใช้งานได้อย่างอิสระ ทั้งส่วนตัวและเชิงพาณิชย์

---

<div align="center">
  <sub>Built with ❤️ | Powered by Anthropic Claude · Next.js · Supabase</sub>
</div>
