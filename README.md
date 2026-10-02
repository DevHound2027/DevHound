# DevHound paper website

论文网站的基础工程，使用 Vue 3、TypeScript 和 Vite。
当前首页只显示论文标题。

## 本地运行

使用 Node.js 22.12+（CI 使用 Node.js 22）。

```bash
npm ci
npm run dev
```

开发地址：`http://localhost:5173/DevHound/`。

## 构建与预览

```bash
npm run build
npm run preview
```

`build` 会先检查 TypeScript，再生成 `dist/`。
预览地址：`http://localhost:4173/DevHound/`。

## 文件结构

- `src/content.ts`：论文标题，网页标题和正文共享此配置。
- `src/App.vue`：首页。
- `src/style.css`：页面样式及移动端布局。
- `vite.config.ts`：开发、构建配置及 `/DevHound/` 部署路径。
- `.github/workflows/deploy.yml`：GitHub Pages 自动构建、部署。

## 发布

GitHub 仓库的 Settings → Pages → Source 使用 GitHub Actions。
推送到 `main` 后，工作流执行 `npm ci` 和 `npm run build`，然后部署 `dist/`。

网站地址：https://devhound2027.github.io/DevHound/

仅提交网站源码和锁文件；`node_modules/`、`dist/` 不提交。
此仓库当前不包含论文 PDF、研究数据、实验代码或结果。
