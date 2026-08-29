# 新增功能能力矩阵

**日期**：2026-08-29  
**概述**：新增 Twinscape 中英文功能能力矩阵，记录现有 API、实现文件、测试和文档位置，并明确 API 扩展边界与延期能力，方便后续需求去重和规划。

---

## 变更文件

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| `apps/docs/guide/capability-matrix.md` | 新增 | 中文能力矩阵与新增需求判定流程。 |
| `apps/docs/en/guide/capability-matrix.md` | 新增 | 英文能力矩阵镜像。 |
| `apps/docs/.vitepress/config.ts` | 修改 | 在中英文指南侧栏加入能力矩阵入口。 |
| `docs/superpowers/plans/2026-08-29-capability-matrix.md` | 新增 | 本次文档实施计划。 |

---

## 改动详情

### `apps/docs/guide/capability-matrix.md`

改动原因：建立一份跨会话可查的功能清单，避免把已有 API 重复实现，也避免把延期能力误判为可直接调用。

关键内容：

- 按模型生命周期、部件与选择、标签、相机与输出、事件、配置、原生对象、示例与文档分组。
- 每项记录公开 API、实现位置、测试位置、文档位置和扩展建议。
- 增加 API 扩展边界、新增需求判定流程和维护规则。
- 单独记录 Vue 适配器、多模型、插件系统等 v0.1 延期能力。

### `apps/docs/.vitepress/config.ts`

改动原因：让能力矩阵成为文档站的正式入口。

关键变化：

```diff
+ { text: '能力矩阵', link: '/guide/capability-matrix' }
+ { text: 'Capability matrix', link: '/en/guide/capability-matrix' }
```

---

## API 变化

无运行时 API 变化。本次仅新增文档索引和文档导航。

---

## 注意事项

- 能力矩阵中的“已实现”要求能同时找到实现、公开入口和验证证据。
- 新增公开方法、配置、事件或类型时，应同步更新中英文矩阵、API/配置文档、示例和更新日志。
- 构建生成的 `apps/docs/.vitepress/cache/` 不属于源文件，不应提交到 Git。

---

## 未完成 / 后续计划

- [ ] 可在后续补充自动化脚本，检查矩阵中的文件路径是否仍然存在。
- [ ] 如 API 数量持续增长，可把矩阵拆成核心 API、配置和路线图三个页面。

---

## 下次新会话开场白

```text
请先阅读以下改动记录，了解上一次的工作内容：
@.clauge/changelogs/2026-08-29_capability-matrix.md

之前已经完成了 Twinscape 功能能力矩阵，记录在上方文件及 apps/docs/guide/capability-matrix.md。现在要在这个基础上处理新的需求：先按矩阵检查是否已有对应 API 或实现，再决定复用、扩展现有 API，还是建立独立设计。
```
