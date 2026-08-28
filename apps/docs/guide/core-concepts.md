# 核心概念

## 一个查看器，一个模型

v0.1 查看器同一时间管理一个模型。调用 `load()` 或 `setModel()` 安装新模型前，会清除旧模型并释放其资源。

## 部件

默认情况下，每个有名称的后代节点都会成为一个部件。部件提供稳定的元数据和投影后的标签坐标；需要访问原生 Three.js 对象时，可调用 `getObject(part.id)`。

## 事件

事件订阅具有完整类型，并会返回取消订阅函数。

```ts
const stop = viewer.on('parts:update', (parts) => renderLabels(parts))
stop()
```

## 资源所有权

将 `Object3D` 传给 `setModel` 后，其渲染资源由查看器管理，并在调用 `clear()` 或 `dispose()` 时释放。
