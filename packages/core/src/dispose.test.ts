import { describe, expect, it, vi } from 'vitest'
import {
  Bone,
  BoxGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Skeleton,
  SkinnedMesh,
  Texture,
} from 'three'
import { disposeObject3D } from './dispose'

describe('disposeObject3D', () => {
  it('disposes geometry, material, and material textures in an object tree', () => {
    const texture = new Texture()
    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geometry, material)
    const root = new Group()
    root.add(mesh)
    const disposeGeometry = vi.spyOn(geometry, 'dispose')
    const disposeMaterial = vi.spyOn(material, 'dispose')
    const disposeTexture = vi.spyOn(texture, 'dispose')

    disposeObject3D(root)

    expect(disposeGeometry).toHaveBeenCalledTimes(1)
    expect(disposeMaterial).toHaveBeenCalledTimes(1)
    expect(disposeTexture).toHaveBeenCalledTimes(1)
  })

  it('disposes shared and specialized GPU resources exactly once', () => {
    const texture = new Texture()
    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial({ map: texture })
    const skeleton = new Skeleton([new Bone()])
    const skinned = new SkinnedMesh(geometry, material)
    skinned.bind(skeleton)
    const instanced = new InstancedMesh(geometry, material, 1)
    const root = new Group()
    root.add(skinned, instanced)
    const disposeGeometry = vi.spyOn(geometry, 'dispose')
    const disposeMaterial = vi.spyOn(material, 'dispose')
    const disposeTexture = vi.spyOn(texture, 'dispose')
    const disposeSkeleton = vi.spyOn(skeleton, 'dispose')
    const disposeInstanced = vi.spyOn(instanced, 'dispose')

    disposeObject3D(root)

    expect(disposeGeometry).toHaveBeenCalledOnce()
    expect(disposeMaterial).toHaveBeenCalledOnce()
    expect(disposeTexture).toHaveBeenCalledOnce()
    expect(disposeSkeleton).toHaveBeenCalledOnce()
    expect(disposeInstanced).toHaveBeenCalledOnce()
  })
})
