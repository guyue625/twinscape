# 核心 API

## `createTwinViewer(container, options?)`

创建并启动 `TwinViewer`。容器可以是 `HTMLElement` 或 CSS 选择器。

## 模型生命周期

- `load(url, options?)` 加载 GLB/GLTF，并返回模型根 `Object3D`。
- `setModel(object)` 安装已有的 `Object3D`。
- `clear()` 移除当前模型并释放其资源。
- `dispose()` 永久销毁查看器；重复调用是安全的。

## 部件与选择

- `getParts()` 返回所有已索引部件的元数据。
- `getPart(id)` 返回指定部件。
- `getObject(id)` 返回底层 Three.js 对象。
- `select(id | null)` 更改选择，并返回 id 是否有效。
- `getSelectedId()` 和 `getSelectedPart()` 用于读取当前选择。

## 相机与输出

- `focusOn(id)` 将相机对准部件，并返回操作是否成功。
- `resetCamera()` 恢复配置中的初始相机状态。
- `screenshot(type?, quality?)` 返回截图 Data URL。

## 事件

可通过 `on()` 和 `off()` 使用 `load:start`、`load:progress`、`load:end`、`load:error`、`resize`、`parts:update` 和 `select` 事件。

## 原生对象

`scene`、`camera`、`renderer` 和 `controls` 均为公开只读属性。
