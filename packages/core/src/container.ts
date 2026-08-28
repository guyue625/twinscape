import type { TwinContainer } from './types'

export function resolveContainer(container: TwinContainer): HTMLElement {
  if (typeof container === 'string') {
    const element = document.querySelector(container)
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Twinscape container "${container}" was not found`)
    }
    return element
  }

  if (!(container instanceof HTMLElement)) {
    throw new TypeError('Twinscape container must be an HTMLElement or selector')
  }
  return container
}
