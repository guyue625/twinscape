import { describe, expect, it } from 'vitest'
import { createLoadGuard } from './loadGuard'

describe('createLoadGuard', () => {
  it('invalidates older and explicitly cancelled loads', () => {
    const guard = createLoadGuard()
    const first = guard.begin()
    const second = guard.begin()

    expect(guard.isCurrent(first)).toBe(false)
    expect(guard.isCurrent(second)).toBe(true)
    guard.invalidate()
    expect(guard.isCurrent(second)).toBe(false)
  })
})
