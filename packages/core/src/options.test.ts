import { describe, expect, it } from 'vitest'
import { DEFAULT_TWIN_VIEWER_OPTIONS, mergeTwinViewerOptions } from './options'

describe('mergeTwinViewerOptions', () => {
  it('keeps defaults when no overrides are provided', () => {
    const options = mergeTwinViewerOptions()

    expect(options.camera.fov).toBe(DEFAULT_TWIN_VIEWER_OPTIONS.camera.fov)
    expect(options.renderer.antialias).toBe(true)
    expect(options.parts.shouldInclude({ name: 'Pump' } as never)).toBe(true)
  })

  it('applies nested overrides without dropping sibling defaults', () => {
    const options = mergeTwinViewerOptions({
      camera: { fov: 60 },
      label: { offset: { x: 12 } },
      renderer: { clearColor: '#101010' },
    })

    expect(options.camera.fov).toBe(60)
    expect(options.camera.near).toBe(DEFAULT_TWIN_VIEWER_OPTIONS.camera.near)
    expect(options.label.offset.x).toBe(12)
    expect(options.label.offset.y).toBe(DEFAULT_TWIN_VIEWER_OPTIONS.label.offset.y)
    expect(options.renderer.clearColor).toBe('#101010')
  })
})
