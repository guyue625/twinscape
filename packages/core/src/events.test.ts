import { describe, expect, it, vi } from 'vitest'
import { createEmitter } from './events'

type TestEvents = {
  ready: { id: string }
  empty: void
}

describe('createEmitter', () => {
  it('emits payloads to subscribed handlers', () => {
    const emitter = createEmitter<TestEvents>()
    const received: string[] = []

    emitter.on('ready', (event) => {
      received.push(event.id)
    })

    emitter.emit('ready', { id: 'motor' })

    expect(received).toEqual(['motor'])
  })

  it('returns an unsubscribe function', () => {
    const emitter = createEmitter<TestEvents>()
    let calls = 0

    const unsubscribe = emitter.on('empty', () => {
      calls += 1
    })

    emitter.emit('empty', undefined)
    unsubscribe()
    emitter.emit('empty', undefined)

    expect(calls).toBe(1)
  })

  it('supports explicit off cleanup', () => {
    const emitter = createEmitter<TestEvents>()
    let calls = 0
    const handler = () => {
      calls += 1
    }

    emitter.on('empty', handler)
    emitter.off('empty', handler)
    emitter.emit('empty', undefined)

    expect(calls).toBe(0)
  })

  it('isolates listener errors so remaining listeners still run', () => {
    const reportError = vi.fn()
    vi.stubGlobal('reportError', reportError)
    const emitter = createEmitter<TestEvents>()
    let calls = 0
    emitter.on('empty', () => {
      throw new Error('consumer failed')
    })
    emitter.on('empty', () => {
      calls += 1
    })

    expect(() => emitter.emit('empty', undefined)).not.toThrow()
    expect(calls).toBe(1)
    expect(reportError).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
