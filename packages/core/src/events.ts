import type { TwinEventHandler } from './types'

export interface TwinEmitter<Events> {
  on<Key extends keyof Events>(event: Key, handler: TwinEventHandler<Events[Key]>): () => void
  off<Key extends keyof Events>(event: Key, handler: TwinEventHandler<Events[Key]>): void
  emit<Key extends keyof Events>(event: Key, payload: Events[Key]): void
  clear(): void
}

export function createEmitter<Events>(): TwinEmitter<Events> {
  const listeners = new Map<keyof Events, Set<TwinEventHandler<unknown>>>()

  return {
    on(event, handler) {
      const handlers = listeners.get(event) ?? new Set()
      handlers.add(handler as TwinEventHandler<unknown>)
      listeners.set(event, handlers)
      return () => this.off(event, handler)
    },
    off(event, handler) {
      listeners.get(event)?.delete(handler as TwinEventHandler<unknown>)
    },
    emit(event, payload) {
      for (const handler of [...(listeners.get(event) ?? [])]) {
        try {
          handler(payload)
        } catch (error) {
          const host = globalThis as typeof globalThis & { reportError?: (error: unknown) => void }
          if (typeof host.reportError === 'function') host.reportError(error)
          else queueMicrotask(() => { throw error })
        }
      }
    },
    clear() {
      listeners.clear()
    },
  }
}
