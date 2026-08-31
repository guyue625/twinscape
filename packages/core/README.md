# @twinscape/core

Twinscape 的框架无关 Three.js 数字孪生查看器核心包。

## 安装

```bash
npm install @twinscape/core three
```

`three` 是 peer dependency，需要由宿主项目安装。

## 快速开始

```ts
import { createTwinViewer } from '@twinscape/core'

const viewer = createTwinViewer('#stage')
await viewer.load('/models/device.glb')

viewer.on('select', (part) => {
  console.log(part?.name)
})
```

容器需要有明确高度：

```css
#stage {
  width: 100%;
  height: 600px;
}
```

## 能力范围

- 加载 GLB / GLTF 模型
- 直接注入 Three.js `Object3D`
- 部件索引、选择、拾取和高亮
- 标签投影、相机聚焦、相机重置和截图
- 加载、尺寸、部件和选择事件
- 访问原生 `scene`、`camera`、`renderer` 和 `controls`
- 完整清理模型资源并销毁查看器

## 版本状态

当前版本为 `0.1.0`，API 仍处于早期迭代阶段。详细 API 请查看仓库文档站。

## 许可证

MIT
