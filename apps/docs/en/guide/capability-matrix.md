# Capability matrix

This page is the Twinscape feature index. When a new request arrives, use it to decide whether the capability already exists, should extend an existing API, or belongs to the deferred roadmap.

## Status definitions

| Status | Meaning |
| --- | --- |
| Implemented | Core code, a public entry point, and baseline tests exist. |
| Implemented (tested) | The capability exists and is mainly covered by unit tests; add integration or example coverage when changing it. |
| Docs / example | A user-facing guide or demo entry, not a new runtime capability. |
| Deferred | Explicitly postponed during design; do not create a parallel temporary API. |

## Implemented capabilities

| Domain | Capability | Status | Public API / config | Implementation | Tests | Docs | Extension guidance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Model lifecycle | Create a viewer | Implemented | `createTwinViewer(container, options?)` | `packages/core/src/createTwinViewer.ts`, `TwinViewer.ts` | `container.test.ts`, `options.test.ts` | `guide/getting-started.md`, `api/core.md` | Extend `TwinViewerOptions` for initialization behavior instead of adding another factory. |
| Model lifecycle | Load GLB/GLTF | Implemented (tested) | `viewer.load(url, options?)`, `TwinLoadOptions` | `loader.ts`, `TwinViewer.ts` | `loadGuard.test.ts` | `guide/getting-started.md`, `api/core.md` | Extend `TwinLoadOptions` and `load:*` events for loader hooks or progress behavior. |
| Model lifecycle | Install, clear, and dispose a model | Implemented (tested) | `setModel()`, `clear()`, `dispose()` | `TwinViewer.ts`, `dispose.ts` | `dispose.test.ts` | `api/core.md` | Keep resource ownership changes in lifecycle methods and tests. |
| Parts and selection | Index parts and metadata | Implemented (tested) | `getParts()`, `getPart(id)`, `TwinPart` | `parts.ts`, `types.ts` | `parts.test.ts` | `guide/core-concepts.md`, `api/core.md` | Extend `parts.shouldInclude` for filtering or `TwinPart` for metadata. |
| Parts and selection | Access the underlying object | Implemented | `getObject(id)` | `TwinViewer.ts` | `parts.test.ts` | `api/core.md` | Use this for one-off Three.js customization of a part. |
| Parts and selection | Selection, highlighting, and picking | Implemented (tested) | `select()`, `getSelectedId()`, `getSelectedPart()`, `interaction`, `highlight` | `picking.ts`, `highlight.ts`, `TwinViewer.ts` | `highlight.test.ts` | `guide/core-concepts.md`, `guide/configuration.md`, `api/core.md` | Extend `interaction.pickEvent` or add an event; do not duplicate picking in demos. |
| Labels | Project part labels | Implemented (tested) | `TwinPart.label`, `label` config, `parts:update` | `labels.ts`, `TwinViewer.ts` | `parts.test.ts` | `guide/core-concepts.md`, `api/core.md` | Extend `label` config and `TwinPart.label` for layout or styling. |
| Camera and output | Focus, reset, and screenshot | Implemented (tested) | `focusOn()`, `resetCamera()`, `screenshot()` | `camera.ts`, `TwinViewer.ts` | `camera.test.ts` | `guide/configuration.md`, `api/core.md` | Extend `camera` config or `screenshot(type, quality)` for new output behavior. |
| Events | Lifecycle, resize, parts, and selection events | Implemented (tested) | `on()`, `off()`, `TwinViewerEventMap` | `events.ts`, `TwinViewer.ts`, `types.ts` | `events.test.ts` | `api/core.md` | Add event types to `TwinViewerEventMap`; avoid polling outside the viewer. |
| Rendering config | Camera, renderer, lights, controls, model, labels, highlight, interaction | Implemented | `TwinViewerOptions`, `mergeTwinViewerOptions()` | `options.ts`, `scene.ts`, `types.ts` | `options.test.ts` | `guide/configuration.md` | Put new options in the existing domain, then update defaults, types, tests, and docs. |
| Native escape hatches | Access Three.js objects | Implemented | `scene`, `camera`, `renderer`, `controls` | `TwinViewer.ts` | `container.test.ts` | `api/core.md` | Use escape hatches for one-off advanced customization; promote repeated needs later. |
| Examples and docs | Vanilla demo and fallback model | Docs / example | Demo page, optional model URL, built-in fallback | `examples/vanilla/index.html`, `src/main.ts` | Build verification | `examples.md` | Demos should validate public APIs, not hold core business logic. |
| Examples and docs | Chinese and English docs | Docs / example | Chinese `/`, English `/en/` | `apps/docs`, `.vitepress/config.ts` | VitePress build verification | The docs site | Update both languages for user-facing capabilities. |

## API extension boundaries

Use this order to avoid duplicate entry points:

1. If an existing option can express the request, extend the matching `TwinViewerOptions` group and update resolved options, defaults, and tests.
2. If the request is lifecycle behavior, extend an existing `TwinViewer` method or `TwinViewerEventMap`.
3. If it concerns parts, extend `TwinPart`, the part filter, or selection events instead of creating another index.
4. For one-off Three.js behavior, use `scene`, `camera`, `renderer`, `controls`, or `getObject(id)`.
5. Promote a capability to a public API only after it appears in multiple projects with stable semantics, and add tests, an example, and bilingual docs.

## Deferred capabilities

These were explicitly deferred in the v0.1 design and should not be assumed to exist:

- Vue 2 / Vue 3 adapters
- Multi-model scenes
- Section cutting and measurements
- Heatmaps
- Animation playback
- Postprocessing
- Camera presets
- Plugin system
- npm publishing workflow

For any request in this list, write a separate design and API boundary first; do not force temporary logic into existing `TwinViewer` methods.

## New-request decision process

For each new request:

1. **Search keywords** in this page, `apps/docs/api/core.md`, `packages/core/src/index.ts`, `packages/core/src/types.ts`, and `TwinViewer.ts`.
2. **Confirm public exposure**: check whether the capability is exported from `index.ts` or only exists as an internal helper.
3. **Confirm behavior**: read implementation and related tests to distinguish implemented, documented-only, demo-only, and missing behavior.
4. **Choose an extension point**: match the existing options, lifecycle methods, event map, `TwinPart`, or native escape hatch.
5. **Check deferred items**: create a separate design if the request belongs to the deferred roadmap.
6. **Sync records**: after implementation, update this matrix, API/config docs, examples, and changelog; if it is only planned, mark it planned rather than implemented.

## Maintenance rules

- Add or update a row whenever a public method, option, event, or type is added.
- Leave migration guidance in the changelog for removed or deprecated APIs.
- Keep paths repository-relative and update them after file moves.
- Mark a row “Implemented” only when implementation, public exposure, and verification evidence all exist.
- Chinese is the default entry point; keep the English page structurally synchronized.
