/**
 * Mock Mode utility
 *
 * Default = mock  →  ไม่ต้องการ API keys ใดๆ เหมาะสำหรับ development/demo
 * Live mode       →  ตั้ง DATA_MODE=live ใน .env.local แล้วกรอก API keys ให้ครบ
 *
 * Checked server-side only (API routes). Use NEXT_PUBLIC_DATA_MODE on the client
 * if you need to show a UI indicator.
 */
export const isMockMode = (): boolean =>
  (process.env.DATA_MODE ?? process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'mock') !== 'live'
