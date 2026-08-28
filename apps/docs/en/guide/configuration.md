# Configuration

All options are optional and grouped by responsibility.

```ts
const viewer = createTwinViewer('#stage', {
  camera: { fov: 45, position: [4, 3, 6], focusPadding: 1.4 },
  renderer: { clearColor: '#f7f8fb', pixelRatioLimit: 2 },
  controls: { enabled: true, enableDamping: true },
  model: { centerAtOrigin: true, targetSize: 4 },
  parts: { shouldInclude: (object) => Boolean(object.name) },
  label: { offset: { x: 0, y: -8 }, anchor: 'top' },
  highlight: { color: '#f56c6c', opacity: 0.86, dimOpacity: 0.18 },
  interaction: { enabled: true, pickEvent: 'click' },
})
```

Set `lights.ambient` or `lights.directional` to `false` to disable that light.
