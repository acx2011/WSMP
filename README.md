# WinPoint 安防管理平台

WinPoint Security Management Platform 报警管理平台前端 Demo。

当前阶段只实现安防报警管理前端 Demo，不接入真实报警主机，不扩展门禁、消防、广播、能耗等模块。所有业务数据均来自本地 Mock/Pinia 状态。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Lucide Vue Next
- SCSS

## 本地运行

推荐团队统一使用 pnpm：

```bash
pnpm install
pnpm run dev
```

也可以使用 npm 运行脚本：

```bash
npm install
npm run dev
```

Vite 默认会使用 `5173` 端口；如果端口被占用，会自动切换到 `5174` 等下一个可用端口。

## 常用命令

```bash
pnpm run dev
pnpm run build
pnpm run preview
```

## Cloudflare Pages 部署

在 Cloudflare Pages 中连接 GitHub 仓库 `acx2011/WSMP`，使用以下配置：

```text
Framework preset: Vite
Install command: pnpm install
Build command: pnpm run build
Build output directory: dist
```

项目包含 `public/_redirects`，构建后会输出到 `dist/_redirects`，用于支持 Vue Router history 模式下的页面刷新和子路由直达。

### 地图配置持久化

地图轮廓、区域名称和布防状态通过 Cloudflare Pages Function 保存到 Workers KV。首次部署时需要在 Cloudflare 中完成一次绑定：

1. 创建 Workers KV 命名空间，例如 `wsmp-config`。
2. 打开 `Workers & Pages > WSMP > Settings > Bindings`。
3. 新增 KV namespace binding，变量名必须为 `WSMP_CONFIG`。
4. Production 和 Preview 环境分别绑定后，重新部署项目。

绑定成功后，地图编辑器显示“云端已连接”，保存结果会在不同浏览器和设备间共享。未配置 KV 或本地接口不可用时，页面会明确显示“仅本机保存”，并回退到浏览器本地存储。

## 当前功能

- 园区总览控制台
- SVG 园区底图轮廓覆盖层
- 报警监控
- 布防管理
- 设备管理
- 自动布防计划
- 事件记录
- 视频联动 Demo
- 用户与权限 Demo
- 系统参数
- 地图轮廓编辑工具

## 开发说明

- 核心 Mock 状态在 `src/stores/security.ts`。
- 公共类型在 `src/types/security.ts`。
- 页面路由在 `src/router/index.ts`。
- 园区底图为 `src/assets/campus-overview.png`。
- 建筑轮廓坐标保存在 `SecurityArea.polygon`，坐标系与底图 SVG `viewBox="0 0 819 542"` 对齐。
- 云端地图配置接口位于 `functions/api/security-settings.ts`。

## 提交注意

不要提交以下目录或文件：

- `node_modules/`
- `dist/`
- `.pnpm-store/`
- `*.tsbuildinfo`

## 验证状态

- `pnpm run build` 已验证通过。
- `pnpm run typecheck` 已验证通过。
