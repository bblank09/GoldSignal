'use client'

export function useDataSource(): 'mock' | 'live' {
  return (process.env.NEXT_PUBLIC_DATA_SOURCE as 'mock' | 'live' | undefined) ?? 'mock'
}
