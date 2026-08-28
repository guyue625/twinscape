import { TwinViewer } from './TwinViewer'
import type { TwinContainer, TwinViewerOptions } from './types'

export function createTwinViewer(
  container: TwinContainer,
  options?: TwinViewerOptions,
): TwinViewer {
  return new TwinViewer(container, options)
}
