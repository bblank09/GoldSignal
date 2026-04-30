import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts and parses JSON from a string that might contain markdown code blocks.
 */
export function extractJSON<T>(text: string): T {
  try {
    // Try parsing the whole thing first
    return JSON.parse(text)
  } catch {
    // Try to find content between triple backticks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (match) {
      try {
        return JSON.parse(match[1])
      } catch (e) {
        console.error('Failed to parse JSON from code block:', e)
        throw e
      }
    }
    
    // Last resort: find anything that looks like a JSON object or array
    const startIdx = text.indexOf('{')
    const endIdx = text.lastIndexOf('}')
    const startArrIdx = text.indexOf('[')
    const endArrIdx = text.lastIndexOf(']')
    
    let potentialJSON = ''
    if (startIdx !== -1 && endIdx !== -1 && (startArrIdx === -1 || startIdx < startArrIdx)) {
      potentialJSON = text.substring(startIdx, endIdx + 1)
    } else if (startArrIdx !== -1 && endArrIdx !== -1) {
      potentialJSON = text.substring(startArrIdx, endArrIdx + 1)
    }
    
    if (potentialJSON) {
      try {
        return JSON.parse(potentialJSON)
      } catch (e) {
        console.error('Failed to parse potential JSON substring:', e)
        throw e
      }
    }
    
    throw new Error('No valid JSON found in text')
  }
}
