import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _redis
}

// Proxy so callers can do `redis.get(...)` unchanged
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    return (getRedis() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PRICE_KEY     = 'gs:price:current'
export const PRICE_CHANNEL = 'gs:price:tick'
export const MACRO_KEY     = 'gs:macro:current'
export const PRICE_TTL     = 600   // 10 minutes
export const MACRO_TTL     = 360
