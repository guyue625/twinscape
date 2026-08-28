import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ResolvedTwinViewerOptions } from './types'

export interface TwinSceneContext {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  controls: OrbitControls | null
}

export function createScene(
  container: HTMLElement,
  options: ResolvedTwinViewerOptions,
): TwinSceneContext {
  const scene = new Scene()
  const camera = new PerspectiveCamera(options.camera.fov, 1, options.camera.near, options.camera.far)
  camera.position.fromArray(options.camera.position)
  camera.lookAt(...options.camera.lookAt)

  const renderer = new WebGLRenderer({
    antialias: options.renderer.antialias,
    alpha: options.renderer.alpha,
  })
  renderer.setClearColor(options.renderer.clearColor, options.renderer.alpha ? 0 : 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.renderer.pixelRatioLimit))
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.appendChild(renderer.domElement)

  if (options.lights.ambient) {
    scene.add(new AmbientLight(options.lights.ambient.color, options.lights.ambient.intensity))
  }
  if (options.lights.directional) {
    const light = new DirectionalLight(
      options.lights.directional.color,
      options.lights.directional.intensity,
    )
    light.position.fromArray(options.lights.directional.position)
    scene.add(light)
  }

  const controls = options.controls.enabled ? new OrbitControls(camera, renderer.domElement) : null
  if (controls) {
    controls.enableDamping = options.controls.enableDamping
    controls.target.fromArray(options.camera.lookAt)
    controls.update()
  }

  return { scene, camera, renderer, controls }
}
