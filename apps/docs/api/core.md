# Core API

## `createTwinViewer(container, options?)`

Creates and starts a `TwinViewer`. The container can be an `HTMLElement` or a selector.

## Model lifecycle

- `load(url, options?)` loads GLB/GLTF and returns its root `Object3D`.
- `setModel(object)` installs an existing `Object3D`.
- `clear()` removes the current model and disposes its resources.
- `dispose()` permanently tears down the viewer. It is safe to call more than once.

## Parts and selection

- `getParts()` returns all indexed part metadata.
- `getPart(id)` returns one part.
- `getObject(id)` returns the underlying Three.js object.
- `select(id | null)` changes selection and returns whether the id was valid.
- `getSelectedId()` and `getSelectedPart()` read selection.

## Camera and output

- `focusOn(id)` frames a part and returns whether it could be framed.
- `resetCamera()` restores the configured camera.
- `screenshot(type?, quality?)` returns a data URL.

## Events

`load:start`, `load:progress`, `load:end`, `load:error`, `resize`, `parts:update`, and `select` are available through `on()` and `off()`.

## Native objects

`scene`, `camera`, `renderer`, and `controls` are public read-only properties.
