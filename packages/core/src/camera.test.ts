import { describe, expect, it } from 'vitest'
import { calculateFocusDistance } from './camera'

describe('calculateFocusDistance', () => {
  it('moves farther away for a narrow viewport', () => {
    const landscape = calculateFocusDistance(2, 45, 16 / 9, 1.4, 0.2)
    const portrait = calculateFocusDistance(2, 45, 9 / 16, 1.4, 0.2)

    expect(portrait).toBeGreaterThan(landscape)
  })
})
