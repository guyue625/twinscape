import type { Material, Object3D, Skeleton, Texture } from 'three'

function collectMaterialTextures(material: Material, textures: Set<Texture>): void {
  const values = Object.values(material) as unknown[]
  for (const value of values) {
    if (value && typeof value === 'object' && 'isTexture' in value) {
      textures.add(value as Texture)
    }
  }
}

export function disposeObject3D(root: Object3D): void {
  const geometries = new Set<{ dispose: () => void }>()
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  const skeletons = new Set<Skeleton>()
  const instances = new Set<{ dispose: () => void }>()

  root.traverse((object) => {
    const resource = object as Object3D & {
      geometry?: { dispose: () => void }
      material?: Material | Material[]
      skeleton?: Skeleton
      isInstancedMesh?: boolean
      dispose?: () => void
    }
    if (resource.geometry) geometries.add(resource.geometry)
    if (Array.isArray(resource.material)) resource.material.forEach((item) => materials.add(item))
    else if (resource.material) materials.add(resource.material)
    if (resource.skeleton) skeletons.add(resource.skeleton)
    if (resource.isInstancedMesh && resource.dispose) instances.add(resource as { dispose: () => void })
  })

  materials.forEach((material) => collectMaterialTextures(material, textures))
  textures.forEach((texture) => texture.dispose())
  materials.forEach((material) => material.dispose())
  geometries.forEach((geometry) => geometry.dispose())
  skeletons.forEach((skeleton) => skeleton.dispose())
  instances.forEach((instance) => instance.dispose())
}
