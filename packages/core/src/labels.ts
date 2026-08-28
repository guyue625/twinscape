import { Box3, Vector3 } from 'three'
import type { Camera, Object3D } from 'three'
import type { TwinPart } from './types'

const box = new Box3()
const point = new Vector3()

export function projectPartLabels(
  parts: TwinPart[],
  objectsById: Map<string, Object3D>,
  camera: Camera,
  width: number,
  height: number,
  offset: { x: number; y: number },
  anchor: 'top' | 'center' | 'bottom',
): boolean {
  let changed = false
  for (const part of parts) {
    const object = objectsById.get(part.id)
    if (!object) continue
    box.setFromObject(object)
    if (box.isEmpty()) object.getWorldPosition(point)
    else {
      box.getCenter(point)
      if (anchor === 'top') point.y = box.max.y
      if (anchor === 'bottom') point.y = box.min.y
    }
    point.project(camera)

    let visibleInHierarchy = true
    let ancestor: Object3D | null = object
    while (ancestor) {
      if (!ancestor.visible) visibleInHierarchy = false
      ancestor = ancestor.parent
    }
    const visible = visibleInHierarchy && point.z >= -1 && point.z <= 1 && Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1
    const x = (point.x * 0.5 + 0.5) * width + offset.x
    const y = (-point.y * 0.5 + 0.5) * height + offset.y
    if (part.label.x !== x || part.label.y !== y || part.label.visible !== visible) changed = true
    part.visible = visibleInHierarchy
    part.label = { x, y, visible }
  }
  return changed
}
