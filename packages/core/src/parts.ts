import type { Object3D } from 'three'
import type { TwinPart } from './types'

export interface TwinPartIndex {
  parts: TwinPart[]
  objectsById: Map<string, Object3D>
  idsByObject: Map<Object3D, string>
}

export function collectParts(
  root: Object3D,
  options: { shouldInclude?: (object: Object3D) => boolean } = {},
): TwinPartIndex {
  const parts: TwinPart[] = []
  const objectsById = new Map<string, Object3D>()
  const idsByObject = new Map<Object3D, string>()
  const shouldInclude = options.shouldInclude ?? ((object: Object3D) => Boolean(object.name))

  root.traverse((object) => {
    if (object === root || !object.name || !shouldInclude(object)) return
    const id = object.uuid
    parts.push({
      id,
      name: object.name,
      objectName: object.name,
      type: object.type,
      visible: object.visible,
      label: { x: 0, y: 0, visible: false },
    })
    objectsById.set(id, object)
    idsByObject.set(object, id)
  })

  return { parts, objectsById, idsByObject }
}
