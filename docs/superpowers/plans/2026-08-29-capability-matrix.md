# 能力矩阵文档 Implementation Plan

> **For agentic workers:** 按步骤执行并在每步完成后验证；本任务仅涉及文档与导航，不改变运行时代码。

**Goal:** 增加一份可持续维护的功能能力矩阵，帮助后续判断新需求是否已有实现、应扩展哪个 API 或属于延期能力。

**Architecture:** 以 VitePress 指南页作为用户可见入口，中文根路径为权威展示，英文路径提供同步镜像。矩阵按功能域记录当前状态、公开 API、实现/测试/文档位置和扩展建议；延期清单单独列出，避免把未实现能力误判为现有能力。

**Tech Stack:** Markdown、VitePress 原生 locales、pnpm。

---

### Task 1: 新增能力矩阵页面

**Files:**
- Create: `apps/docs/guide/capability-matrix.md`
- Create: `apps/docs/en/guide/capability-matrix.md`

- [ ] 编写中文能力矩阵，覆盖模型生命周期、部件与选择、相机与输出、事件、渲染配置、原生逃生口、示例与文档，并为每项记录 API、实现、测试、文档和扩展方式。
- [ ] 编写英文镜像，保持章节和表格结构一致。
- [ ] 单独列出延期能力：Vue 适配器、多模型、剖切、测量、热力图、动画、后处理、相机预设和插件系统。
- [ ] 加入“新增需求判定流程”和“维护规则”，约定实现或 API 变化时同步更新矩阵。

### Task 2: 接入文档导航

**Files:**
- Modify: `apps/docs/.vitepress/config.ts`

- [ ] 在中文指南侧栏加入“能力矩阵”，链接 `/guide/capability-matrix`。
- [ ] 在英文指南侧栏加入 “Capability matrix”，链接 `/en/guide/capability-matrix`。

### Task 3: 验证

- [ ] 运行 Markdown/路径检查，确认中英文页面存在且链接目标正确。
- [ ] 运行 `pnpm.cmd --filter @twinscape/docs build`。
- [ ] 运行 `git diff --check`。
