import type { Object3D } from 'three'

export type TwinContainer = string | HTMLElement
export type TwinPartId = string

export interface TwinPart {
  id: TwinPartId
  name: string
  objectName: string
  type: string
  visible: boolean
  label: { x: number; y: number; visible: boolean }
}

export interface TwinLoadOptions {
  onProgress?: (progress: number) => void
  loader?: (url: string, onProgress?: (progress: number) => void) => Promise<Object3D>
}

export interface TwinViewerOptions {
  camera?: {
    fov?: number
    near?: number
    far?: number
    position?: [number, number, number]
    lookAt?: [number, number, number]
    focusPadding?: number
  }
  renderer?: {
    antialias?: boolean
    alpha?: boolean
    clearColor?: string | number
    pixelRatioLimit?: number
  }
  lights?: {
    ambient?: false | { color?: string | number; intensity?: number }
    directional?: false | {
      color?: string | number
      intensity?: number
      position?: [number, number, number]
    }
  }
  controls?: { enabled?: boolean; enableDamping?: boolean }
  model?: {
    centerAtOrigin?: boolean
    targetSize?: number
    initialRotation?: [number, number, number]
  }
  parts?: { shouldInclude?: (object: Object3D) => boolean }
  label?: { offset?: { x?: number; y?: number }; anchor?: 'top' | 'center' | 'bottom' }
  highlight?: {
    enabled?: boolean
    color?: string | number
    opacity?: number
    dimOpacity?: number
  }
  interaction?: { enabled?: boolean; pickEvent?: 'click' | 'pointerdown' }
}

export interface ResolvedTwinViewerOptions {
  camera: Required<NonNullable<TwinViewerOptions['camera']>>
  renderer: Required<NonNullable<TwinViewerOptions['renderer']>>
  lights: {
    ambient: false | { color: string | number; intensity: number }
    directional: false | {
      color: string | number
      intensity: number
      position: [number, number, number]
    }
  }
  controls: Required<NonNullable<TwinViewerOptions['controls']>>
  model: Required<NonNullable<TwinViewerOptions['model']>>
  parts: { shouldInclude: (object: Object3D) => boolean }
  label: { offset: { x: number; y: number }; anchor: 'top' | 'center' | 'bottom' }
  highlight: Required<NonNullable<TwinViewerOptions['highlight']>>
  interaction: Required<NonNullable<TwinViewerOptions['interaction']>>
}

export interface TwinViewerEventMap {
  'load:start': { url: string }
  'load:progress': { url: string; progress: number }
  'load:end': { url: string; object: Object3D }
  'load:error': { url: string; error: unknown }
  resize: { width: number; height: number }
  'parts:update': TwinPart[]
  select: TwinPart | null
}

export type TwinEventHandler<Event> = (event: Event) => void
