# Core concepts

## One viewer, one model

The v0.1 viewer owns one model at a time. `load()` or `setModel()` clears and disposes the previous model before installing the next one.

## Parts

Every named descendant is a part by default. Parts expose stable metadata and projected label coordinates; use `getObject(part.id)` when native Three.js access is needed.

## Events

Subscriptions are typed and return an unsubscribe function.

```ts
const stop = viewer.on('parts:update', (parts) => renderLabels(parts))
stop()
```

## Ownership

After an `Object3D` is passed to `setModel`, the viewer owns its render resources and disposes them during `clear()` or `dispose()`.
