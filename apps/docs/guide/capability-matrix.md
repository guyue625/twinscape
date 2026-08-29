# 能力矩阵

这份页面是 Twinscape 的功能索引。新增需求时，先按下表查找已有能力，再决定复用、扩展 API、增加独立模块，还是登记为延期能力。

## 状态说明

| 状态 | 含义 |
| --- | --- |
| 已实现 | 核心代码、公开入口和基础测试均已存在，可直接使用。 |
| 已实现（测试覆盖） | 功能已存在，但当前主要由单元测试覆盖；改动时应补充对应集成或示例验证。 |
| 文档/示例 | 主要是使用说明或演示入口，不代表新增了核心运行时能力。 |
| 已延期 | 设计阶段明确暂不实现，不应重复创建临时 API。 |

## 已实现能力

| 功能域 | 能力 | 状态 | 公开 API / 配置 | 实现位置 | 测试位置 | 文档位置 | 后续扩展建议 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 模型生命周期 | 创建查看器 | 已实现 | `createTwinViewer(container, options?)` | `packages/core/src/createTwinViewer.ts`、`TwinViewer.ts` | `container.test.ts`、`options.test.ts` | `guide/getting-started.md`、`api/core.md` | 初始化行为优先扩展 `TwinViewerOptions`，不要新增第二个工厂。 |
| 模型生命周期 | 加载 GLB/GLTF | 已实现（测试覆盖） | `viewer.load(url, options?)`、`TwinLoadOptions` | `loader.ts`、`TwinViewer.ts` | `loadGuard.test.ts` | `guide/getting-started.md`、`api/core.md` | 加载器钩子或进度需求扩展 `TwinLoadOptions` 与 `load:*` 事件。 |
| 模型生命周期 | 注入、清理、销毁模型 | 已实现（测试覆盖） | `setModel()`、`clear()`、`dispose()` | `TwinViewer.ts`、`dispose.ts` | `dispose.test.ts` | `api/core.md` | 资源所有权变化应优先扩展生命周期方法和测试。 |
| 部件与选择 | 部件索引与元数据 | 已实现（测试覆盖） | `getParts()`、`getPart(id)`、`TwinPart` | `parts.ts`、`types.ts` | `parts.test.ts` | `guide/core-concepts.md`、`api/core.md` | 过滤规则扩展 `parts.shouldInclude`，元数据字段扩展 `TwinPart`。 |
| 部件与选择 | 底层对象访问 | 已实现 | `getObject(id)` | `TwinViewer.ts` | `parts.test.ts` | `api/core.md` | 单个部件的 Three.js 定制通过该方法完成。 |
| 部件与选择 | 选择、高亮与拾取 | 已实现（测试覆盖） | `select()`、`getSelectedId()`、`getSelectedPart()`、`interaction`、`highlight` | `picking.ts`、`highlight.ts`、`TwinViewer.ts` | `highlight.test.ts` | `guide/core-concepts.md`、`guide/configuration.md`、`api/core.md` | 新交互类型扩展 `interaction.pickEvent` 或新增事件，不在示例层复制拾取逻辑。 |
| 标签 | 部件标签投影 | 已实现（测试覆盖） | `TwinPart.label`、`label` 配置、`parts:update` | `labels.ts`、`TwinViewer.ts` | `parts.test.ts` | `guide/core-concepts.md`、`api/core.md` | 标签样式或布局优先扩展 `label` 配置和 `TwinPart.label`。 |
| 相机与输出 | 聚焦、重置与截图 | 已实现（测试覆盖） | `focusOn()`、`resetCamera()`、`screenshot()` | `camera.ts`、`TwinViewer.ts` | `camera.test.ts` | `guide/configuration.md`、`api/core.md` | 相机行为扩展 `camera` 配置；新输出格式扩展 `screenshot(type, quality)`。 |
| 事件 | 生命周期、尺寸、部件和选择事件 | 已实现（测试覆盖） | `on()`、`off()`、`TwinViewerEventMap` | `events.ts`、`TwinViewer.ts`、`types.ts` | `events.test.ts` | `api/core.md` | 新通知统一增加事件类型，不在组件外层私自轮询。 |
| 渲染配置 | 相机、渲染器、灯光、控制器、模型、标签、高亮、交互 | 已实现 | `TwinViewerOptions`、`mergeTwinViewerOptions()` | `options.ts`、`scene.ts`、`types.ts` | `options.test.ts` | `guide/configuration.md` | 新选项按职责归入现有配置域，并同步默认值、类型、测试和配置文档。 |
| 原生逃生口 | Three.js 原生对象访问 | 已实现 | `scene`、`camera`、`renderer`、`controls` | `TwinViewer.ts` | `container.test.ts` | `api/core.md` | 一次性高级定制优先使用逃生口，重复需求成熟后再提升为正式 API。 |
| 示例与文档 | Vanilla 示例与内置模型 | 文档/示例 | 示例页面、可选模型 URL、内置 fallback | `examples/vanilla/index.html`、`src/main.ts` | 构建验证 | `examples.md` | 示例只验证公开 API，不应承载核心业务逻辑。 |
| 示例与文档 | 中英文文档 | 文档/示例 | 中文 `/`、英文 `/en/` | `apps/docs`、`.vitepress/config.ts` | VitePress 构建验证 | 当前文档站 | 新增用户可见能力时同步更新两种语言页面。 |

## 当前 API 扩展边界

优先按以下顺序扩展，避免重复造入口：

1. 已有配置能表达的需求：扩展对应 `TwinViewerOptions` 分组，并同步 `ResolvedTwinViewerOptions`、默认值和测试。
2. 已有生命周期行为的需求：扩展 `TwinViewer` 现有方法或 `TwinViewerEventMap`，保持生命周期语义集中。
3. 已有部件能力的需求：扩展 `TwinPart`、部件过滤规则或选择事件，不新增平行的部件索引系统。
4. Three.js 专属的一次性能力：先使用 `scene`、`camera`、`renderer`、`controls` 或 `getObject(id)`。
5. 多个项目重复出现且语义稳定的能力：再提升为正式公共 API，并增加单元测试、示例和双语文档。

## 已延期能力

以下能力在 v0.1 设计中明确延期，目前不要假设它们已存在：

- Vue 2 / Vue 3 适配器
- 多模型场景
- 剖切、测量、热力图
- 动画播放
- 后处理
- 相机预设
- 插件系统
- npm 发布流程

如果新需求属于以上范围，应先单独写设计和 API 边界，再实现；不要把临时逻辑塞进 `TwinViewer` 的现有方法中。

## 新增需求判定流程

每次新增需求按以下记录顺序检查：

1. **关键词检索**：在本页、`apps/docs/api/core.md`、`packages/core/src/index.ts`、`packages/core/src/types.ts` 和 `TwinViewer.ts` 中搜索需求关键词。
2. **确认公开性**：判断能力是否已从 `index.ts` 导出，还是仅存在内部工具函数。
3. **确认行为**：阅读实现和相关测试，区分已实现、仅文档描述、仅示例演示或完全缺失。
4. **选择扩展点**：优先匹配现有配置域、生命周期方法、事件映射、`TwinPart` 或原生逃生口。
5. **检查延期清单**：若命中延期能力，先建立独立设计，不直接改现有 API。
6. **同步记录**：实现后更新本矩阵、API 文档、配置文档、示例和更新日志；如果只做方案，登记为“计划中”而非“已实现”。

## 维护规则

- 任何新增公开方法、配置项、事件或类型，都必须在本页增加一行或更新对应行。
- 任何删除或废弃 API，都要在“注意事项”或更新日志中留下迁移说明。
- 矩阵中的路径以仓库相对路径书写，文件移动后必须同步修正。
- “已实现”至少要求实现、公开入口和验证三者都能找到证据。
- 中文页面是默认入口，英文页面必须保持结构同步；可先更新中文，再补英文镜像。
