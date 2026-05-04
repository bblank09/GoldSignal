'use client'

import Link from 'next/link'
import type { GoldPrice } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { usePriceStream } from '@/lib/hooks/use-price-stream'

const IS_MOCK = (process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'mock') !== 'live'

interface Props {
  price: GoldPrice
  activeTab: 'feed' | 'signals' | 'chart'
}

export default function Topbar({ price: initialPrice, activeTab }: Props) {
  const price = usePriceStream(initialPrice)
  const isUp = price.change >= 0

  return (
    <div
      className="flex items-center px-4 flex-shrink-0 relative z-[100]"
      style={{ height: 48, background: 'var(--bg1)', borderBottom: '1px solid var(--bdr)' }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-mono text-[14px] font-semibold text-gold flex items-center gap-2 flex-shrink-0 no-underline"
        style={{ color: 'var(--gold)', textDecoration: 'none' }}
      >
        ◈ GoldSignal
      </Link>

      {/* Nav */}
      <nav className="flex ml-6 flex-1">
        {[
          { href: '/',        label: 'Feed',    key: 'feed' as const },
          { href: '/signals', label: 'Signals', key: 'signals' as const },
          { href: '/chart',   label: 'Chart',   key: 'chart' as const },
        ].map(({ href, label, key }) => (
          <Link
            key={key}
            href={href}
            className="px-[14px] flex items-center text-[13px] font-medium transition-colors no-underline"
            style={{
              height: 48,
              borderBottom: `2px solid ${activeTab === key ? 'var(--gold)' : 'transparent'}`,
              color: activeTab === key ? 'var(--gold)' : 'var(--t2)',
              fontWeight: activeTab === key ? 600 : 500,
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right: price + mode pill */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px]" style={{ color: 'var(--gold)' }}>
          XAU/USD&nbsp; {formatPrice(price.price)}
        </span>
        <span
          className="font-mono text-[11px]"
          style={{ color: isUp ? 'var(--bull)' : 'var(--bear)' }}
        >
          {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{price.change_pct.toFixed(2)}%
        </span>

        {IS_MOCK ? (
          /* Mock mode badge */
          <div
            className="flex items-center gap-[5px] rounded-[3px] px-2 py-[3px] font-mono text-[11px]"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' }}
            title="Running with mock data. Set DATA_MODE=live in .env.local to use real APIs."
          >
            ◎ MOCK
          </div>
        ) : (
          /* Live mode badge */
          <div
            className="flex items-center gap-[5px] rounded-[3px] px-2 py-[3px] font-mono text-[11px]"
            style={{ background: 'var(--bullbg)', border: '1px solid var(--bull2)', color: 'var(--bull)' }}
          >
            <div className="w-[5px] h-[5px] rounded-full animate-pulse2" style={{ background: 'var(--bull)' }} />
            LIVE
          </div>
        )}
      </div>
    </div>
  )
}
