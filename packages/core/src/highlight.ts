import type { Color, Material, Object3D } from 'three'
import type { ResolvedTwinViewerOptions } from './types'

type MaterialOwner = Object3D & { material?: Material | Material[] }
type MutableMaterial = Material & {
  color?: Color
  opacity: number
  transparent: boolean
}

const originalMaterials = new WeakMap<Object3D, Material | Material[]>()

function asArray(material: Material | Material[]): Material[] {
  return Array.isArray(material) ? material : [material]
}

export function clearHighlight(model: Object3D): void {
  model.traverse((object) => {
    const owner = object as MaterialOwner
    const original = originalMaterials.get(object)
    if (!original || !owner.material) return
    asArray(owner.material).forEach((material) => material.dispose())
    owner.material = original
    originalMaterials.delete(object)
  })
}

export function applyHighlight(
  model: Object3D,
  selected: Object3D | null,
  options: ResolvedTwinViewerOptions['highlight'],
): void {
  clearHighlight(model)
  if (!selected || !options.enabled) return

  const selectedObjects = new Set<Object3D>()
  selected.traverse((object) => selectedObjects.add(object))
  model.traverse((object) => {
    const owner = object as MaterialOwner
    if (!owner.material) return
    const original = owner.material
    const cloned = Array.isArray(original)
      ? original.map((material) => material.clone())
      : original.clone()
    originalMaterials.set(object, original)
    owner.material = cloned

    for (const material of asArray(cloned)) {
      const mutable = material as MutableMaterial
      if (selectedObjects.has(object)) {
        mutable.color?.set(options.color)
        mutable.opacity = options.opacity
      } else {
        mutable.opacity = options.dimOpacity
      }
      mutable.transparent = mutable.opacity < 1
      material.needsUpdate = true
    }
  })
}
