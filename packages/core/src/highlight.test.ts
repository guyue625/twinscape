import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three'
import { describe, expect, it } from 'vitest'
import { applyHighlight, clearHighlight } from './highlight'
import { mergeTwinViewerOptions } from './options'

describe('highlight', () => {
  it('isolates shared materials while highlighting and restores them afterward', () => {
    const shared = new MeshBasicMaterial({ color: '#ffffff' })
    const selected = new Mesh(new BoxGeometry(), shared)
    const other = new Mesh(new BoxGeometry(), shared)
    const root = new Group()
    root.add(selected, other)
    const options = mergeTwinViewerOptions().highlight

    applyHighlight(root, selected, options)

    expect(selected.material).not.toBe(other.material)
    expect(selected.material.opacity).toBe(options.opacity)
    expect(other.material.opacity).toBe(options.dimOpacity)

    clearHighlight(root)
    expect(selected.material).toBe(shared)
    expect(other.material).toBe(shared)
  })
})
