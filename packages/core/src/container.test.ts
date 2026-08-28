import { describe, expect, it } from 'vitest'
import { resolveContainer } from './container'

describe('resolveContainer', () => {
  it('accepts an HTMLElement', () => {
    const element = document.createElement('div')

    expect(resolveContainer(element)).toBe(element)
  })

  it('accepts a selector that resolves to an HTMLElement', () => {
    const element = document.createElement('div')
    element.id = 'stage'
    document.body.appendChild(element)

    expect(resolveContainer('#stage')).toBe(element)
  })

  it('throws a clear error for missing selectors', () => {
    expect(() => resolveContainer('#missing')).toThrow(
      'Twinscape container "#missing" was not found',
    )
  })
})
