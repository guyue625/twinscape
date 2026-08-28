import { Box3, Sphere, Vector3 } from 'three'
import type { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { calculateFocusDistance } from './camera'
import { disposeObject3D } from './dispose'
import { createEmitter } from './events'
import { applyHighlight, clearHighlight } from './highlight'
import { projectPartLabels } from './labels'
import { createLoadGuard } from './loadGuard'
import { loadModel } from './loader'
import { mergeTwinViewerOptions } from './options'
import { collectParts } from './parts'
import { pickPartId } from './picking'
import { observeContainer } from './resize'
import { createScene } from './scene'
import type {
  ResolvedTwinViewerOptions,
  TwinContainer,
  TwinEventHandler,
  TwinLoadOptions,
  TwinPart,
  TwinPartId,
  TwinViewerEventMap,
  TwinViewerOptions,
} from './types'
import { resolveContainer } from './container'

const center = new Vector3()
const size = new Vector3()
const sphere = new Sphere()
const direction = new Vector3()

export class TwinViewer {
  readonly container: HTMLElement
  readonly options: ResolvedTwinViewerOptions
  readonly scene: Scene
  readonly camera: PerspectiveCamera
  readonly renderer: WebGLRenderer
  readonly controls: OrbitControls | null

  private readonly emitter = createEmitter<TwinViewerEventMap>()
  private readonly loadGuard = createLoadGuard()
  private readonly initialCameraPosition = new Vector3()
  private readonly initialTarget = new Vector3()
  private model: Object3D | null = null
  private parts: TwinPart[] = []
  private objectsById = new Map<string, Object3D>()
  private idsByObject = new Map<Object3D, string>()
  private selectedId: TwinPartId | null = null
  private width = 1
  private height = 1
  private frameId = 0
  private disposed = false
  private readonly stopResize: () => void
  private readonly pointerHandler: (event: PointerEvent | MouseEvent) => void

  constructor(container: TwinContainer, options: TwinViewerOptions = {}) {
    this.container = resolveContainer(container)
    this.options = mergeTwinViewerOptions(options)
    const context = createScene(this.container, this.options)
    this.scene = context.scene
    this.camera = context.camera
    this.renderer = context.renderer
    this.controls = context.controls
    this.initialCameraPosition.copy(this.camera.position)
    this.initialTarget.fromArray(this.options.camera.lookAt)

    this.stopResize = observeContainer(this.container, (width, height) => {
      this.width = width
      this.height = height
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height, false)
      this.emitter.emit('resize', { width, height })
      this.updateLabels(true)
    })

    this.pointerHandler = (event) => {
      if (!this.options.interaction.enabled || !this.model) return
      this.select(
        pickPartId(event, this.renderer.domElement, this.camera, this.model, this.idsByObject),
      )
    }
    this.renderer.domElement.addEventListener(this.options.interaction.pickEvent, this.pointerHandler)
    this.animate()
  }

  async load(url: string, options: TwinLoadOptions = {}): Promise<Object3D> {
    this.assertActive()
    const loadToken = this.loadGuard.begin()
    this.emitter.emit('load:start', { url })
    try {
      const object = await loadModel(url, {
        ...options,
        onProgress: (progress) => {
          options.onProgress?.(progress)
          if (!this.disposed && this.loadGuard.isCurrent(loadToken)) {
            this.emitter.emit('load:progress', { url, progress })
          }
        },
      })
      if (this.disposed || !this.loadGuard.isCurrent(loadToken)) {
        disposeObject3D(object)
        const error = new Error('TwinViewer load was superseded or cancelled')
        error.name = 'AbortError'
        throw error
      }
      this.installModel(object)
      this.emitter.emit('load:end', { url, object })
      return object
    } catch (error) {
      if (!this.disposed) this.emitter.emit('load:error', { url, error })
      throw error
    }
  }

  setModel(object: Object3D): Object3D {
    this.assertActive()
    this.loadGuard.invalidate()
    return this.installModel(object)
  }

  clear(): void {
    this.loadGuard.invalidate()
    this.clearModel()
  }

  private installModel(object: Object3D): Object3D {
    this.clearModel()
    object.rotation.fromArray(this.options.model.initialRotation)
    object.updateMatrixWorld(true)

    const bounds = new Box3().setFromObject(object)
    if (!bounds.isEmpty()) {
      bounds.getSize(size)
      const maxSize = Math.max(size.x, size.y, size.z)
      if (maxSize > 0 && this.options.model.targetSize > 0) {
        object.scale.multiplyScalar(this.options.model.targetSize / maxSize)
        object.updateMatrixWorld(true)
        bounds.setFromObject(object)
      }
      if (this.options.model.centerAtOrigin) {
        bounds.getCenter(center)
        object.position.sub(center)
      }
    }

    this.model = object
    this.scene.add(object)
    object.updateMatrixWorld(true)
    const index = collectParts(object, this.options.parts)
    this.parts = index.parts
    this.objectsById = index.objectsById
    this.idsByObject = index.idsByObject
    this.updateLabels(false, false)
    this.emitter.emit('parts:update', this.getParts())
    return object
  }

  private clearModel(): void {
    if (!this.model) return
    const hadSelection = this.selectedId !== null
    clearHighlight(this.model)
    this.scene.remove(this.model)
    disposeObject3D(this.model)
    this.model = null
    this.parts = []
    this.objectsById.clear()
    this.idsByObject.clear()
    this.selectedId = null
    this.emitter.emit('parts:update', [])
    if (hadSelection) this.emitter.emit('select', null)
  }

  getParts(): TwinPart[] {
    return this.parts.map((part) => ({ ...part, label: { ...part.label } }))
  }

  getPart(id: TwinPartId): TwinPart | undefined {
    const part = this.parts.find((candidate) => candidate.id === id)
    return part ? { ...part, label: { ...part.label } } : undefined
  }

  getObject(id: TwinPartId): Object3D | undefined {
    return this.objectsById.get(id)
  }

  select(id: TwinPartId | null): boolean {
    if (id !== null && !this.objectsById.has(id)) return false
    if (this.selectedId === id) return true
    this.selectedId = id
    if (this.model) applyHighlight(this.model, id ? this.objectsById.get(id) ?? null : null, this.options.highlight)
    this.emitter.emit('select', id ? this.getPart(id) ?? null : null)
    return true
  }

  getSelectedId(): TwinPartId | null {
    return this.selectedId
  }

  getSelectedPart(): TwinPart | null {
    return this.selectedId ? this.getPart(this.selectedId) ?? null : null
  }

  focusOn(id: TwinPartId): boolean {
    const object = this.objectsById.get(id)
    if (!object) return false
    const bounds = new Box3().setFromObject(object)
    if (bounds.isEmpty()) return false
    bounds.getBoundingSphere(sphere)
    const distance = calculateFocusDistance(
      sphere.radius,
      this.camera.fov,
      this.camera.aspect,
      this.options.camera.focusPadding,
      this.camera.near * 2,
    )
    const target = this.controls?.target ?? this.initialTarget
    direction.copy(this.camera.position).sub(target).normalize()
    if (!Number.isFinite(direction.x) || direction.lengthSq() === 0) direction.set(1, 0.75, 1).normalize()
    this.camera.position.copy(sphere.center).addScaledVector(direction, distance)
    this.camera.lookAt(sphere.center)
    if (this.controls) {
      this.controls.target.copy(sphere.center)
      this.controls.update()
    }
    return true
  }

  resetCamera(): void {
    this.camera.position.copy(this.initialCameraPosition)
    this.camera.lookAt(this.initialTarget)
    if (this.controls) {
      this.controls.target.copy(this.initialTarget)
      this.controls.update()
    }
  }

  screenshot(type = 'image/png', quality?: number): string {
    this.renderer.render(this.scene, this.camera)
    return this.renderer.domElement.toDataURL(type, quality)
  }

  on<Key extends keyof TwinViewerEventMap>(
    event: Key,
    handler: TwinEventHandler<TwinViewerEventMap[Key]>,
  ): () => void {
    return this.emitter.on(event, handler)
  }

  off<Key extends keyof TwinViewerEventMap>(
    event: Key,
    handler: TwinEventHandler<TwinViewerEventMap[Key]>,
  ): void {
    this.emitter.off(event, handler)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.loadGuard.invalidate()
    let firstError: unknown
    const cleanup = (action: () => void): void => {
      try {
        action()
      } catch (error) {
        firstError ??= error
      }
    }
    cleanup(() => cancelAnimationFrame(this.frameId))
    cleanup(this.stopResize)
    cleanup(() => this.renderer.domElement.removeEventListener(
      this.options.interaction.pickEvent,
      this.pointerHandler,
    ))
    cleanup(() => this.clearModel())
    cleanup(() => this.controls?.dispose())
    cleanup(() => this.renderer.dispose())
    cleanup(() => this.renderer.domElement.remove())
    this.emitter.clear()
    if (firstError) throw firstError
  }

  private animate = (): void => {
    if (this.disposed) return
    this.controls?.update()
    this.updateLabels(false)
    this.renderer.render(this.scene, this.camera)
    this.frameId = requestAnimationFrame(this.animate)
  }

  private updateLabels(forceEmit: boolean, emitChanges = true): void {
    if (!this.parts.length) return
    const changed = projectPartLabels(
      this.parts,
      this.objectsById,
      this.camera,
      this.width,
      this.height,
      this.options.label.offset,
      this.options.label.anchor,
    )
    if (forceEmit || (changed && emitChanges)) this.emitter.emit('parts:update', this.getParts())
  }

  private assertActive(): void {
    if (this.disposed) throw new Error('TwinViewer has been disposed')
  }
}
