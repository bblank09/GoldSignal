-- ─── Enums ────────────────────────────────────────────────────────────────────
create type sentiment_t       as enum ('Bullish','Bearish','Neutral');
create type impact_t          as enum ('HIGH','MEDIUM','LOW');
create type bias_t            as enum ('Bullish','Bearish','Neutral');
create type zone_type_t       as enum ('Strong','Speculative');
create type impact_direction_t as enum ('positive','negative','mixed');
create type time_horizon_t    as enum ('intraday','short','medium','long');

-- ─── Articles ─────────────────────────────────────────────────────────────────
create table articles (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  source       text        not null,
  url          text        not null unique,
  published_at timestamptz not null,
  category_id  text        not null,
  factors      text[]      not null default '{}',
  raw_excerpt  text,
  created_at   timestamptz not null default now()
);
create index articles_published_idx  on articles(published_at desc);
create index articles_category_idx   on articles(category_id);

-- ─── Article Analysis ─────────────────────────────────────────────────────────
create table article_analysis (
  article_id        uuid                primary key references articles(id) on delete cascade,
  sentiment         sentiment_t         not null,
  impact_score      smallint            not null check (impact_score between 0 and 10),
  impact_level      impact_t            not null,
  impact_direction  impact_direction_t  not null,
  time_horizon      time_horizon_t      not null,
  key_levels        jsonb               not null,
  factors           text[]              not null default '{}',
  summary           text                not null,
  action_points     text                not null,
  bull_case         jsonb               not null,
  base_case         jsonb               not null,
  bear_case         jsonb               not null,
  prob_bull         numeric(4,3)        not null,
  z_score           text                not null,
  expected_move     text                not null,
  sources_cited     text[]              not null default '{}',
  confidence        numeric(4,3)        not null,
  generated_at      timestamptz         not null default now(),
  model             text                not null
);
create index analysis_impact_idx on article_analysis(impact_level, generated_at desc);

-- ─── Price Ticks ──────────────────────────────────────────────────────────────
create table price_ticks (
  ts           timestamptz  primary key,
  price        numeric(10,2) not null,
  bid          numeric(10,2) not null,
  ask          numeric(10,2) not null,
  change       numeric(10,2) not null,
  change_pct   numeric(7,4)  not null,
  day_low      numeric(10,2) not null,
  day_high     numeric(10,2) not null,
  source       text          not null
);
create index price_ticks_ts_idx on price_ticks(ts desc);

-- ─── Macro Snapshots ──────────────────────────────────────────────────────────
create table macro_snapshots (
  ts      timestamptz primary key,
  payload jsonb       not null
);

-- ─── Daily Signals ────────────────────────────────────────────────────────────
create table daily_signals (
  date                date        primary key,
  bias                bias_t      not null,
  strength            smallint    not null check (strength between 1 and 5),
  buy_zones           jsonb       not null,
  sell_zones          jsonb       not null,
  weekly_outlook      text        not null,
  supporting_factors  text[]      not null,
  risk_factors        text[]      not null,
  executive_summary   text        not null,
  generated_at        timestamptz not null default now()
);

-- ─── Economic Events ──────────────────────────────────────────────────────────
create table economic_events (
  id          uuid        primary key default gen_random_uuid(),
  iso_date    timestamptz not null,
  date_label  text        not null,
  event       text        not null,
  country     text        not null,
  importance  impact_t    not null,
  forecast    text,
  previous    text,
  actual      text,
  gold_impact text        not null,
  unique (iso_date, event)
);
create index events_date_idx on economic_events(iso_date);

-- ─── RLS — public read; writes only through service role ──────────────────────
alter table articles          enable row level security;
alter table article_analysis  enable row level security;
alter table price_ticks       enable row level security;
alter table macro_snapshots   enable row level security;
alter table daily_signals     enable row level security;
alter table economic_events   enable row level security;

create policy "public read articles"   on articles          for select using (true);
create policy "public read analysis"   on article_analysis  for select using (true);
create policy "public read prices"     on price_ticks       for select using (true);
create policy "public read macro"      on macro_snapshots   for select using (true);
create policy "public read signals"    on daily_signals     for select using (true);
create policy "public read events"     on economic_events   for select using (true);
