import { describe, it, expect } from 'vitest'
import { formatPopulation } from './formatPopulation'

describe('formatPopulation', () => {
  it('formats valid numbers correctly', () => {
    expect(formatPopulation(1000000)).toBe('1,000,000')
    expect(formatPopulation(1234567)).toBe('1,234,567')
    expect(formatPopulation(100)).toBe('100')
  })

  it('returns "N/A" for N/A string', () => {
    expect(formatPopulation('N/A')).toBe('N/A')
  })

  it('returns "N/A" for undefined', () => {
    expect(formatPopulation(undefined)).toBe('N/A')
  })

  it('returns "N/A" for null', () => {
    expect(formatPopulation(null)).toBe('N/A')
  })

  it('returns "N/A" for zero', () => {
    expect(formatPopulation(0)).toBe('N/A')
  })

  it('handles large numbers', () => {
    expect(formatPopulation(1234567890)).toBe('1,234,567,890')
  })
})

