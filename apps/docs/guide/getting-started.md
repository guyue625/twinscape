# Getting started

Install the core package and its Three.js peer dependency:

```bash
pnpm add @twinscape/core three
```

Give the viewer a container with an explicit size, then load a GLB or GLTF model.

```ts
import { createTwinViewer } from '@twinscape/core'

const viewer = createTwinViewer('#stage')
await viewer.load('/models/device.glb')

viewer.on('select', (part) => {
  console.log(part?.name)
})
```

```css
#stage {
  width: 100%;
  height: 600px;
}
```

Call `viewer.dispose()` when the host screen is permanently removed.
