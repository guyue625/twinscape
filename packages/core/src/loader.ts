import type { Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { TwinLoadOptions } from './types'

export async function loadModel(url: string, options: TwinLoadOptions = {}): Promise<Object3D> {
  if (options.loader) return options.loader(url, options.onProgress)

  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(url, (event) => {
    const progress = event.total > 0 ? event.loaded / event.total : 0
    options.onProgress?.(progress)
  })
  return gltf.scene
}
