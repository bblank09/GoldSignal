// Use toFixed + manual comma insert instead of toLocaleString to avoid
// ICU differences between Node.js (Windows minimal ICU) and the browser.
export function formatPrice(n: number, decimals = 2): string {
  if (!isFinite(n)) return (0).toFixed(decimals)
  const [int, dec] = n.toFixed(decimals).split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec !== undefined ? `${intFormatted}.${dec}` : intFormatted
}

// Same pattern for arbitrary numbers (used in charts / news cards)
export function formatNumber(n: number, decimals = 0): string {
  if (!isFinite(n)) return '0'
  const [int, dec] = n.toFixed(decimals).split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec !== undefined && decimals > 0 ? `${intFormatted}.${dec}` : intFormatted
}

export function formatPct(n: number, decimals = 2): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}%`
}

export function formatChange(n: number, decimals = 2): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}`
}

export function formatTimeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
