import type { ResolvedTwinViewerOptions, TwinViewerOptions } from './types'

const defaultAmbient = { color: '#ffffff', intensity: 0.7 }
const defaultDirectional = {
  color: '#ffffff',
  intensity: 1.2,
  position: [4, 6, 5] as [number, number, number],
}

export const DEFAULT_TWIN_VIEWER_OPTIONS: ResolvedTwinViewerOptions = {
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [4, 3, 6],
    lookAt: [0, 0, 0],
    focusPadding: 1.4,
  },
  renderer: { antialias: true, alpha: true, clearColor: '#f7f8fb', pixelRatioLimit: 2 },
  lights: {
    ambient: defaultAmbient,
    directional: defaultDirectional,
  },
  controls: { enabled: true, enableDamping: true },
  model: { centerAtOrigin: true, targetSize: 4, initialRotation: [0, 0, 0] },
  parts: { shouldInclude: (object) => Boolean(object.name) },
  label: { offset: { x: 0, y: -8 }, anchor: 'top' },
  highlight: { enabled: true, color: '#f56c6c', opacity: 0.86, dimOpacity: 0.18 },
  interaction: { enabled: true, pickEvent: 'click' },
}

export function mergeTwinViewerOptions(options: TwinViewerOptions = {}): ResolvedTwinViewerOptions {
  const defaults = DEFAULT_TWIN_VIEWER_OPTIONS
  return {
    camera: { ...defaults.camera, ...options.camera },
    renderer: { ...defaults.renderer, ...options.renderer },
    lights: {
      ambient:
        options.lights?.ambient === false
          ? false
          : { ...defaultAmbient, ...options.lights?.ambient },
      directional:
        options.lights?.directional === false
          ? false
          : { ...defaultDirectional, ...options.lights?.directional },
    },
    controls: { ...defaults.controls, ...options.controls },
    model: { ...defaults.model, ...options.model },
    parts: { ...defaults.parts, ...options.parts },
    label: {
      ...defaults.label,
      ...options.label,
      offset: { ...defaults.label.offset, ...options.label?.offset },
    },
    highlight: { ...defaults.highlight, ...options.highlight },
    interaction: { ...defaults.interaction, ...options.interaction },
  }
}
