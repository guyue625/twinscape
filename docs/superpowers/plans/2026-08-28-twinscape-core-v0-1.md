# Twinscape Core v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable Twinscape core package with a vanilla demo, docs scaffold, and project rule files.

**Architecture:** The repo is a pnpm workspace. `packages/core` contains a framework-free Three.js viewer with typed public API. `examples/vanilla` validates the package in a browser, while `apps/docs` reserves the documentation structure.

**Tech Stack:** TypeScript, Three.js, tsup, Vite, VitePress, Vitest, pnpm.

---

## File Structure

- Modify: `package.json` to repair JSON and add workspace scripts.
- Modify: `pnpm-workspace.yaml` to include `packages/*`, `examples/*`, and `apps/*`.
- Modify: `tsconfig.base.json` only if build/test config needs shared compiler settings.
- Create: `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/tsup.config.ts`, `packages/core/vitest.config.ts`.
- Create: `packages/core/src/*.ts` modules for options, events, disposal, containers, parts, labels, scene, loading, picking, highlight, resize, and `TwinViewer`.
- Create: `packages/core/src/*.test.ts` for behavior that does not need a real WebGL context.
- Create: `examples/vanilla/package.json`, `examples/vanilla/index.html`, `examples/vanilla/src/main.ts`, `examples/vanilla/src/styles.css`.
- Create: `apps/docs/package.json`, `apps/docs/index.md`, `apps/docs/guide/*.md`, `apps/docs/api/*.md`, `apps/docs/.vitepress/config.ts`.
- Create: `.rules/architecture.md`, `.rules/api-design.md`, `.rules/coding-style.md`, `.rules/release.md`, `.rules/docs-style.md`.

## Tasks

### Task 1: Workspace Scaffold

- [ ] Repair root `package.json` with valid UTF-8 JSON and scripts:

```json
{
  "name": "twinscape",
  "version": "0.0.0",
  "private": true,
  "description": "Framework-agnostic digital twin rendering toolkit",
  "packageManager": "pnpm@10.17.0",
  "scripts": {
    "build": "pnpm -r --filter \"./packages/*\" run build",
    "dev": "pnpm --filter @twinscape/vanilla-example dev",
    "docs:dev": "pnpm --filter @twinscape/docs dev",
    "test": "pnpm -r --filter \"./packages/*\" run test",
    "typecheck": "pnpm -r --filter \"./packages/*\" run typecheck"
  },
  "devDependencies": {
    "typescript": "5.9.2"
  },
  "engines": {
    "node": ">=18"
  }
}
```

- [ ] Update `pnpm-workspace.yaml` to include `apps/*`.
- [ ] Create empty project rule files with headings only.

### Task 2: Core Package Manifest

- [ ] Create `packages/core/package.json` with `three` as a peer dependency and `tsup`, `vitest`, `jsdom`, `@types/node`, and `three` as dev dependencies.
- [ ] Create TypeScript, tsup, and vitest config files.
- [ ] Export public API from `packages/core/src/index.ts`.

### Task 3: TDD For Pure Core Utilities

- [ ] Write failing tests for `createEmitter`, `mergeTwinViewerOptions`, `resolveContainer`, `collectParts`, and `disposeObject3D`.
- [ ] Run `pnpm --filter @twinscape/core test` and confirm these tests fail because implementations are missing.
- [ ] Implement minimal modules to pass the tests.
- [ ] Re-run tests and keep them green.

### Task 4: Viewer Runtime

- [ ] Implement scene creation with camera, renderer, lights, and optional OrbitControls.
- [ ] Implement `TwinViewer` lifecycle methods: `load`, `setModel`, `clear`, `dispose`, `getParts`, `getPart`, `getObject`, `select`, `getSelectedId`, `getSelectedPart`, `focusOn`, `resetCamera`, `on`, and `off`.
- [ ] Implement resize, label projection, pointer picking, and basic highlight/dimming.
- [ ] Keep `packages/core` free of Vue or other framework imports.

### Task 5: Vanilla Demo

- [ ] Create a Vite demo that imports `createTwinViewer` from `@twinscape/core`.
- [ ] Generate a simple fallback `Object3D` from Three.js primitives so the demo works without a GLB file.
- [ ] Render projected part labels and selection state.
- [ ] Allow an optional model URL typed into the page.

### Task 6: Documentation Scaffold

- [ ] Create a VitePress docs app with navigation for Guide, API, Configuration, Examples, and Changelog.
- [ ] Add concise starter pages that document the intended v0.1 API.
- [ ] Keep docs examples aligned with the core package names and methods.

### Task 7: Verification

- [ ] Install dependencies with `pnpm install`.
- [ ] Run `pnpm --filter @twinscape/core test`.
- [ ] Run `pnpm --filter @twinscape/core build`.
- [ ] Run `pnpm --filter @twinscape/core typecheck`.
- [ ] Run root `pnpm build` where practical.
- [ ] Start demo/docs dev server only if verification needs a rendered check.

## Self-Review

- Spec coverage: The tasks cover core package, vanilla demo, docs scaffold, and rule files from the design spec.
- Placeholder scan: This plan avoids TBD/TODO placeholders.
- Type consistency: Public names match the spec: `createTwinViewer`, `TwinViewer`, `TwinViewerOptions`, `TwinPart`, and event names such as `parts:update` and `select`.
