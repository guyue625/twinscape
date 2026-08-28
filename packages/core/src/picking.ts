import { Raycaster, Vector2 } from 'three'
import type { Camera, Object3D } from 'three'

const raycaster = new Raycaster()
const pointer = new Vector2()

export function pickPartId(
  event: PointerEvent | MouseEvent,
  canvas: HTMLCanvasElement,
  camera: Camera,
  model: Object3D,
  idsByObject: Map<Object3D, string>,
): string | null {
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return null
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  raycaster.setFromCamera(pointer, camera)

  for (const hit of raycaster.intersectObject(model, true)) {
    let object: Object3D | null = hit.object
    while (object && object !== model) {
      const id = idsByObject.get(object)
      if (id) return id
      object = object.parent
    }
  }
  return null
}
