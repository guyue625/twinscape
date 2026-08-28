# Twinscape Core v0.1 Design

## Goal

Twinscape v0.1 will start as a practical Three.js-based digital twin viewer library. A project should be able to install the package, create a viewer with a small API, load a 3D model, inspect selectable parts, react to selection events, and adjust common visual behavior through configuration instead of copying viewer code between projects.

The first implementation slice includes the core package, a vanilla demo, a documentation app scaffold, and empty project rule files for later refinement.

## Product Shape

The repository will be a pnpm workspace with these top-level areas:

- `packages/core`: publishes `@twinscape/core`, a framework-free TypeScript package built on Three.js.
- `examples/vanilla`: a minimal runnable demo for validating the core package in a browser.
- `apps/docs`: a documentation site scaffold in the style of framework docs, with room for guide pages, API pages, examples, and release notes.
- `.rules`: project rule documents that can start empty and be filled in over time.

Vue 2 and Vue 3 adapters are important, but they are not part of this first implementation slice. They will be added after the core viewer API proves usable.

## Scope

v0.1 should feel like a usable model viewer, not only a WebGL bootstrapper.

Included:

- Scene, camera, WebGL renderer, lights, and OrbitControls setup.
- GLTF/GLB loading through Three.js loaders.
- Direct `Object3D` model injection.
- Container resize handling.
- Model clearing and complete resource disposal.
- Part indexing from named model nodes.
- 2D label position projection for parts.
- Pointer picking and selected part state.
- Basic selected-part highlight and optional dimming of other parts.
- Camera helpers: `focusOn` and `resetCamera`.
- Event subscription for load, error, resize, parts update, and selection changes.
- Escape hatches to access native `scene`, `camera`, `renderer`, and `controls`.
- A vanilla demo that can run even without an external GLB by using a generated fallback model.
- A docs app scaffold and empty project rule files.

Deferred:

- Vue 2 and Vue 3 adapter packages.
- Multi-model scenes.
- Section cutting, measurements, heatmaps, animation playback, postprocessing, camera presets, and a plugin system.
- Publishing to npm.

## Recommended Usage

The preferred core API should stay short:

```ts
import { createTwinViewer } from '@twinscape/core'

const viewer = createTwinViewer('#stage')
await viewer.load('/models/device.glb')

viewer.on('select', (part) => {
  console.log(part)
})
```

Common operations:

```ts
viewer.getParts()
viewer.getPart(partId)
viewer.getObject(partId)

viewer.select(partId)
viewer.select(null)
viewer.getSelectedPart()
viewer.getSelectedId()

viewer.focusOn(partId)
viewer.resetCamera()

viewer.clear()
viewer.dispose()
```

The viewer should also expose:

```ts
viewer.scene
viewer.camera
viewer.renderer
viewer.controls
```

These escape hatches are intentional. They let a host project solve advanced local needs without waiting for Twinscape to wrap every Three.js capability.

## Configuration

Configuration should be grouped by domain and fully optional:

```ts
createTwinViewer('#stage', {
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [4, 3, 6],
    lookAt: [0, 0, 0],
    focusPadding: 1.4,
  },
  renderer: {
    antialias: true,
    alpha: true,
    clearColor: '#f7f8fb',
    pixelRatioLimit: 2,
  },
  lights: {
    ambient: { color: '#ffffff', intensity: 0.7 },
    directional: { color: '#ffffff', intensity: 1.2, position: [4, 6, 5] },
  },
  controls: {
    enabled: true,
    enableDamping: true,
  },
  model: {
    centerAtOrigin: true,
    targetSize: 4,
    initialRotation: [0, 0, 0],
  },
  parts: {
    shouldInclude: (object) => Boolean(object.name),
  },
  label: {
    offset: { x: 0, y: -8 },
    anchor: 'top',
  },
  highlight: {
    color: '#f56c6c',
    opacity: 0.86,
    dimOpacity: 0.18,
    enabled: true,
  },
  interaction: {
    enabled: true,
    pickEvent: 'click',
  },
})
```

Defaults should allow the viewer to run when no options are provided. The default part rule is all named nodes, because Twinscape should not inherit project-specific EAM naming conventions.

## Public Types

The first core package should define stable public types for:

- `TwinViewer`
- `TwinViewerOptions`
- `TwinViewerEventMap`
- `TwinPart`
- `TwinPartId`
- `TwinLoadOptions`
- `TwinContainer`

`TwinPart` should include at least:

```ts
type TwinPart = {
  id: string
  name: string
  objectName: string
  type: string
  visible: boolean
  label: {
    x: number
    y: number
    visible: boolean
  }
}
```

The internal object map should remain internal, with `viewer.getObject(partId)` as the public escape hatch.

## Events

The event system should be small and typed:

```ts
viewer.on('load:start', handler)
viewer.on('load:progress', handler)
viewer.on('load:end', handler)
viewer.on('load:error', handler)
viewer.on('resize', handler)
viewer.on('parts:update', handler)
viewer.on('select', handler)
```

`on` should return an unsubscribe function. `off` should also be available for explicit cleanup.

## Internal Modules

`packages/core/src` should be split by responsibility:

- `index.ts`: public exports.
- `createTwinViewer.ts`: friendly factory function.
- `TwinViewer.ts`: high-level lifecycle and orchestration.
- `scene.ts`: scene, camera, renderer, lights, and controls creation.
- `loader.ts`: GLTF/GLB loading and custom loader hooks.
- `parts.ts`: named-node indexing and part metadata.
- `labels.ts`: world-to-container label projection.
- `picking.ts`: pointer-to-raycast selection.
- `highlight.ts`: selected-part visual state.
- `resize.ts`: ResizeObserver management.
- `events.ts`: typed emitter.
- `dispose.ts`: geometry, material, and texture disposal helpers.
- `options.ts`: default options and deep merge.
- `types.ts`: public and shared internal types.

Files should stay focused. If one module starts owning unrelated behavior, split it before it becomes the new copy-paste burden.

## Error Handling

`createTwinViewer` should throw a clear error when the container cannot be resolved or is not an `HTMLElement`.

`load` should emit `load:start`, then either `load:end` or `load:error`. It should reject with the original error after emitting `load:error`, so callers can use either events or `try/catch`.

Calling selection and focus methods with an unknown part id should not crash the viewer. These methods should return `false` for failed operations where that is useful.

`dispose` should be idempotent. Calling it twice should not throw.

## Testing

Automated tests should focus on behavior that does not need a real WebGL context:

- Option merging keeps defaults and applies nested overrides.
- The event emitter subscribes, emits, unsubscribes, and supports `off`.
- Container resolution accepts selectors and elements, and rejects missing selectors.
- Resource disposal traverses object trees and calls geometry/material/texture disposers.
- Part indexing includes named nodes by default and honors `parts.shouldInclude`.

Browser rendering, camera controls, GLTF loading, pointer picking, and label projection should be validated through `examples/vanilla` during v0.1. These can get browser tests later once the package shape settles.

## Documentation App

`apps/docs` should be created as a documentation site scaffold. It does not need polished content in v0.1, but it should reserve structure for:

- Getting started.
- Core concepts.
- Core API.
- Configuration.
- Examples.
- Changelog or release notes.

The docs should treat `createTwinViewer` as the recommended entry and keep examples concise.

## Project Rules

Create `.rules` with placeholder files:

- `architecture.md`
- `api-design.md`
- `coding-style.md`
- `release.md`
- `docs-style.md`

These files can start empty or with a single title. They exist so project standards can be filled in gradually.

## Acceptance Criteria

- The repository can install dependencies with pnpm.
- `@twinscape/core` builds to ESM, CJS, and type declarations.
- `three` is a peer dependency of `@twinscape/core`.
- The vanilla demo can create a viewer and display a fallback model without a GLB file.
- A consumer can load a GLB URL with `viewer.load(url)`.
- A consumer can list parts, select a part, receive selection events, and cleanly dispose the viewer.
- `apps/docs` and `.rules` exist with the planned initial structure.
- No Vue, Vue Router, or host-framework imports appear in `packages/core`.
