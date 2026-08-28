import { describe, expect, it } from 'vitest'
import { Group, Mesh, MeshBasicMaterial, BoxGeometry } from 'three'
import { collectParts } from './parts'

describe('collectParts', () => {
  it('includes all named descendants by default', () => {
    const root = new Group()
    const namedGroup = new Group()
    const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
    namedGroup.name = 'Pump'
    mesh.name = 'Valve'
    root.add(namedGroup)
    namedGroup.add(mesh)

    const index = collectParts(root)

    expect(index.parts.map((part) => part.name)).toEqual(['Pump', 'Valve'])
    expect(index.objectsById.get(index.parts[1]!.id)).toBe(mesh)
  })

  it('honors the shouldInclude option', () => {
    const root = new Group()
    const included = new Group()
    const excluded = new Group()
    included.name = 'Pump'
    excluded.name = 'Bolt'
    root.add(included, excluded)

    const index = collectParts(root, {
      shouldInclude: (object) => object.name !== 'Bolt',
    })

    expect(index.parts.map((part) => part.name)).toEqual(['Pump'])
  })
})
