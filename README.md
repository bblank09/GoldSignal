# ◈ GoldSignal

**GoldSignal** คือระบบ Dashboard สำหรับติดตามและวิเคราะห์ราคาทองคำ (XAU/USD) ระดับ Institutional-grade แบบ Real-time ที่ผสานการทำงานของการดึงข้อมูลดิบทางสถิติ, ข่าวสาร, และปัจจัยทางเศรษฐกิจมหภาค (Macroeconomics) เข้ากับ **AI (Anthropic Claude)** เพื่อสังเคราะห์สัญญาณการเทรด (Trading Signal) และวิเคราะห์ Sentiment ของตลาดโดยอัตโนมัติ 

---

## 🎯 ทำโปรเจกต์นี้มาทำไม? (Purpose)

นักเทรดทองคำมักจะต้องเปิดหลายหน้าต่างเพื่อดูข้อมูลต่างกัน เช่น กราฟราคาจาก TradingView, ข่าวจาก Forexlive หรือ Reuters, ดัชนี DXY, พันธบัตรรัฐบาล (Yields) ฯลฯ **GoldSignal ถูกสร้างขึ้นมาเพื่อแก้ปัญหานี้** โดยมีจุดประสงค์หลักคือ:

1. **ศูนย์รวมข้อมูล (Single Source of Truth):** รวมข้อมูลที่ส่งผลต่อราคาทองคำทั้งหมดไว้ในหน้าเดียว ทั้ง Technical (กราฟ), Fundamental (ข่าว/ภาพรวมเศรษฐกิจ), และ Sentiment (มุมมองของตลาด)
2. **วิเคราะห์ด้วย AI อัตโนมัติ:** ใช้ AI ในการอ่านข่าวแทนมนุษย์แบบ Real-time และสรุปออกมาเป็นตัวเลขความน่าจะเป็น, ระดับผลกระทบ (Impact), และจุดเข้าซื้อ/ขาย (Buy/Sell Zones)
3. **ระบบอัตโนมัติ (Fully Autonomous):** ระบบมี Cron jobs ที่รันตัวเองอยู่ตลอดเวลาเพื่อดึงราคา, อัปเดตข่าว, และให้ AI วิเคราะห์โดยที่ผู้ใช้ไม่ต้องกดปุ่มใดๆ

---

## 🛠 ฟีเจอร์หลัก (Key Features)

- **Live Price Streaming:** ติดตามราคาทองคำล่าสุด (Bid/Ask) และเทียบราคาเป็นเงินบาท (Baht weight) 
- **Macro Snapshot:** ดึงข้อมูลดัชนี DXY, US10Y, US2Y, VIX, WTI และวิเคราะห์ความสัมพันธ์ที่มีต่อราคาทอง
- **AI News Sentiment Analysis:** กวาดข่าวจาก RSS (เช่น ForexLive, Kitco) เข้ามาให้ AI ประเมินว่าเป็น Bullish หรือ Bearish พร้อมบอกเหตุผลสนับสนุน
- **Automated Daily Signal:** สรุปมุมมองประจำวัน พร้อมแนวรับ-แนวต้านอัตโนมัติ (Buy Zones / Sell Zones)
- **Advanced Charting:** ผสาน TradingView Advanced Widget เข้ามาใช้งานตรงๆ สามารถตีเส้นและดูอินดิเคเตอร์ได้เต็มรูปแบบ

---

## 💻 วิธีการติดตั้ง (Installation)

**ข้อกำหนดล่วงหน้า (Prerequisites):**
- Node.js (เวอร์ชัน 18+ ขึ้นไป)
- บัญชี Supabase (สำหรับ Database)
- บัญชี Upstash (สำหรับ Redis Cache)
- คีย์ API ของ Anthropic (Claude)

**ขั้นตอนการติดตั้ง:**

1. **โคลนโปรเจกต์:**
   ```bash
   git clone https://github.com/bblank09/GoldSignal.git
   cd GoldSignal
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables:**
   คัดลอกไฟล์ `.env.local.example` แล้วเปลี่ยนชื่อเป็น `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```
   จากนั้นให้กรอกค่า API Keys ต่างๆ ในไฟล์ `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` และ `SUPABASE_SERVICE_ROLE_KEY` (เอาจากหน้า Supabase)
   - `UPSTASH_REDIS_REST_URL` และ `UPSTASH_REDIS_REST_TOKEN` (เอาจากหน้า Upstash)
   - `ANTHROPIC_API_KEY` (คีย์ของ Claude AI)
   - `CRON_SECRET` (ตั้งค่ารหัสลับอะไรก็ได้สำหรับการรัน Cron job)

4. **ตั้งค่า Database (Supabase):**
   นำโค้ด SQL จากไฟล์ `supabase/schema.sql` ไปรันในหน้า SQL Editor ของโปรเจกต์ Supabase เพื่อสร้างตารางต่างๆ

---

## 🚀 ใช้อย่างไร และวิธีดูหน้าเว็บ (How to Use)

1. **เริ่มต้นเซิร์ฟเวอร์แบบ Local:**
   ```bash
   npm run dev
   ```
   จากนั้นเปิดเว็บเบราว์เซอร์และเข้าไปที่ `http://localhost:3000`

2. **การรันระบบอัตโนมัติ (Cron Jobs):**
   ในโหมด Local คุณจะต้องเรียกใช้งาน URL เหล่านี้เพื่อจำลองการทำงานของ Cron job (ระบบจะไปดึงข้อมูลมาเก็บใส่ Database):
   *เปิด Terminal ใหม่และรันคำสั่งเหล่านี้ (แทนค่า $CRON_SECRET ด้วยคำที่คุณตั้งไว้)*
   - **ดึงราคาล่าสุด:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/price-tick`
   - **ดึงตัวเลข Macro:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/macro-snapshot`
   - **ดึงข่าวสารล่าสุด:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/fetch-news`
   - **ให้ AI วิเคราะห์ข่าว:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/analyze-news`
   - **สร้าง Signal ประจำวัน:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/daily-signal`

3. **การอ่านข้อมูลบนหน้าจอ (Navigation & Usage):**
   - **Sidebar (ซ้ายมือ):** จะอัปเดตราคาแบบ Real-time, บอก Sentiment จากข่าวสารทั้งหมดใน 24 ชั่วโมงที่ผ่านมา, และแสดงทิศทางรายวัน (Daily Bias) สรุปว่าวันนี้ควรเทรดฝั่งไหน
   - **แท็บ Feed (หน้าแรก):** หน้ารวมข่าวสาร (News Feed) ซึ่งแต่ละข่าวจะมี AI สรุปและประเมินมาให้เรียบร้อยว่าข่าวนี้ส่งผลอย่างไรต่อทองคำ คุณสามารถกดกรอง (Filter) ดูเฉพาะข่าวที่เป็น Bullish หรือ Bearish ได้
   - **แท็บ Signals:** หน้าที่ AI จะเอาข้อมูลทั้งหมดมากาง และสรุปทำเป็น Signal อย่างละเอียด บอกเหตุผลว่าทำไมถึงมองขึ้นหรือลง พร้อมให้แนวรับ-แนวต้านสำหรับการเทรด
   - **แท็บ Chart:** ดูกราฟจริงจาก TradingView สามารถใช้วิเคราะห์เทคนิคคอลควบคู่ไปกับ Signal ได้เลย

*(เมื่อคุณต้องการนำขึ้น Production จริง (เช่น Vercel) ระบบ Cron jobs เหล่านี้จะถูกตั้งค่าให้เรียกใช้อัตโนมัติในพื้นหลัง คุณก็เพียงแค่เปิดเว็บเข้ามาดูและรับข้อมูลที่พร้อมเทรดได้ทันที)*
