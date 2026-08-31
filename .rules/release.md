# Release

`@twinscape/core` 的发布流程。所有命令都在 `packages/core` 下执行,除非另有说明。

## 一次性准备

新机器上只需做一次。

### 1. registry 指向官方源

发布必须走官方源,`registry.npmmirror.com` 是只读镜像,`npm publish` 会失败。

```bash
npm config get registry
```

如果不是 `https://registry.npmjs.org`:

```bash
npm config set registry https://registry.npmjs.org
```

想保留镜像加速装包,可以不改全局配置,只在发布时加参数:

```bash
npm publish --registry https://registry.npmjs.org
```

### 2. organization

`@twinscape` 是作用域,需要 npmjs.com 上存在同名 organization。在 [npmjs.com/org/create](https://www.npmjs.com/org/create) 创建 `twinscape`,选 Free 计划(公开包不限量)。

### 3. 登录

```bash
npm login
npm whoami   # 确认账号
```

## 每次发布

### 1. 确认工作区干净

```bash
git status
```

有未提交改动先处理掉,避免发布内容和 git 历史对不上。

### 2. 改版本号

`package.json` 的 `version` 字段。当前处于 `0.x` 阶段,规则:

| 改动 | 版本 |
| --- | --- |
| 修 bug、内部重构,API 不变 | `0.1.0` → `0.1.1` |
| 加新 API,或有破坏性改动 | `0.1.0` → `0.2.0` |

`0.x` 期间破坏性改动走 minor,这是 semver 对 major 为 0 的约定。API 稳定后再发 `1.0.0`,之后破坏性改动才升 major。

用命令改可以顺手打好 tag:

```bash
npm version patch   # 或 minor
```

它会改 `package.json`、创建 commit 和 `v0.1.1` tag。手动改版本号的话,记得自己补 commit 和 tag。

### 3. 本地验证

```bash
pnpm run typecheck
pnpm run test
pnpm run build
```

再确认打包产物只含该含的东西:

```bash
npm pack --dry-run
```

预期是 9 个文件左右:`dist/` 下的 6 个产物、`README.md`、`LICENSE`、`package.json`。**源码 `src/` 和测试文件不应该出现** —— 由 `package.json` 的 `files: ["dist"]` 控制。

### 4. 发布

```bash
npm publish
```

`prepublishOnly` 钩子会自动重跑 typecheck、test、build,任何一步失败就中断,不会推出坏包。所以第 3 步的手动验证是为了早点发现问题,不是多余的。

作用域包默认私有,`package.json` 里的 `publishConfig.access: "public"` 已经处理了这点,不需要额外加 `--access public`。

### 5. 推送

```bash
git push && git push --tags
```

npm 上的版本和 git tag 要能对上,方便以后追溯某个版本的源码。

### 6. 验收

```bash
npm view @twinscape/core version
```

## 下游项目使用

```bash
npm install @twinscape/core three
```

`three` 是 peer dependency,**必须由宿主项目自己装**,否则会报模块找不到。版本要满足 `^0.185.0`。

```ts
import { createTwinViewer } from '@twinscape/core'

const viewer = createTwinViewer('#stage')
await viewer.load('/models/device.glb')
```

容器需要有明确高度,否则画布高度为 0:

```css
#stage {
  width: 100%;
  height: 600px;
}
```

## 发布前本地联调

不想为了验证改动就发一个版本上去,有两种办法。

### 装 tarball(推荐,最接近真实安装)

```bash
# 在 packages/core
npm pack                    # 产出 twinscape-core-0.1.0.tgz

# 在测试项目
npm install /绝对路径/twinscape-core-0.1.0.tgz
```

这条路径会真实走一遍 `files`、`exports`、类型解析,能提前发现漏文件、入口配错这类问题。

### link(改代码即时生效,适合反复调试)

```bash
# 在 packages/core
pnpm link --global

# 在测试项目
pnpm link --global @twinscape/core
```

注意 link 方式下 `three` 可能被解析成两份实例,出现 `instanceof` 判断失败之类的诡异问题。真出问题时改用 tarball 方式验证。

## 常见问题

### `ENEEDAUTH` / `need auth`

没登录,或 registry 指向了镜像源。先 `npm config get registry` 确认,再 `npm login`。

### `E404 Scope not found`

`@twinscape` organization 还没创建,回到一次性准备第 2 步。

### `E403 Forbidden`

包名被占用,或当前账号没有该 org 的发布权限。`npm whoami` 确认账号对不对。

### `E402 Payment Required`

作用域包被当成私有包发布了。检查 `publishConfig.access` 是否为 `public`。

### 版本号已存在

npm 不允许覆盖已发布的版本,只能升版本号重发。

### 发错了怎么办

72 小时内可以撤回:

```bash
npm unpublish @twinscape/core@0.1.1
```

超过 72 小时不能撤回,只能标记废弃并发新版本:

```bash
npm deprecate @twinscape/core@0.1.1 "有严重问题,请升级到 0.1.2"
```

撤回过的版本号不能再次使用。所以发布前跑 `npm pack --dry-run` 比事后补救便宜得多。

## 维护提醒

`@types/three` 放在 `dependencies` 而非 `devDependencies`,因为 three.js 不自带类型,下游需要它才能正确解析本包的类型声明。

它目前钉死在 `0.185.0`,而 peer 允许 `^0.185.0`。升级 `three` 的 peer 范围时,记得同步升 `@types/three`,否则下游装了更高的 three 小版本会出现类型对不上。
