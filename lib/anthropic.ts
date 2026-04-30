import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODEL = 'claude-sonnet-4-5'
export const MAX_TOKENS = 2048

// Retry helper — max 3 attempts with exponential backoff
export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: Error = new Error('Unknown error')
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (i < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * 2 ** i))
      }
    }
  }
  throw lastError
}
