# DevHound paper website

DevHound 论文项目网站初版，使用 Vue 3、TypeScript 和 Vite。
内容根据 `fse-paper/main.pdf` 与当前 LaTeX 章节整理；参考 VirtualME 和 DevSkill 的论文展示结构。

页面包括论文主张与研究概览、Kubernetes 动机示例、双记忆方法和 QA 流程、可交互的解释深度示例、RQ1/RQ2/RQ3 最终结果、两段演示视频和研究资源。支持中英双语切换，保留匿名作者状态。

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

- `src/content.ts`：论文标题、资源链接、视频配置、研究概览、RQ1 数据及示例文案。
- `src/results-data.json`：RQ2 指标、五维评分提升、混淆矩阵，以及 RQ3 的 18 行完整构建与成本数据。
- `src/components/AdditionalResults.vue`：RQ2、RQ3 结果图表和完整数据表。
- `src/i18n.ts`、`src/locales/zh.json`：语言切换、中文文案、页面元数据及语言偏好保存。
- `src/App.vue`：单页网站与交互。
- `src/style.css`：页面样式及移动端布局。
- `src/components/Icon.vue`：本地 SVG 图标。
- `src/assets/fonts/`：本地字体。
- `public/licenses/`：字体的 SIL Open Font License，随网站一起发布。
- `public/paper/devhound.pdf`：当前论文 PDF 的网站副本。
- `public/dataset/devhound.zip`：用户提供的数据包，包含仓库问答数据和人工评估材料。
- `public/figures/`：论文图转出的 WebP 图片，点击可放大。
- `public/videos/`：记忆构建和仓库问答的 MP4 演示，以及从视频提取的封面。
- `vite.config.ts`：开发、构建配置及 `/DevHound/` 部署路径。
- `.github/workflows/deploy.yml`：GitHub Pages 自动构建、部署。

## 发布

GitHub 仓库的 Settings → Pages → Source 使用 GitHub Actions。
推送到 `main` 后，工作流执行 `npm ci` 和 `npm run build`，然后部署 `dist/`。

网站地址：https://devhound2027.github.io/DevHound/
网站通过此工作流发布；后续推送到 `main` 会自动更新线上版本。

仅提交网站源码和锁文件；`node_modules/`、`dist/` 不提交。
当前包含匿名论文 PDF、论文图、全部三个 RQ 的最终结果、两段演示视频及数据包。DevHound 实现尚未加入。

## 替换视频与数据集

所有入口集中在 `src/content.ts` 的 `resources` 中。值为 `null` 时显示 `Coming soon`，不会生成无效下载或播放链接。

- **论文**：用新版文件替换 `public/paper/devhound.pdf`，或修改 `resources.paper`。
- **数据集**：将 `resources.dataset` 改成正式的 HTTPS 下载地址；使用本地文件时，将文件放入 `public/`，并使用 `assetUrl('dataset/文件名.zip')`，自动兼容 `/DevHound/` 路径。
- **代码**：将 `resources.code` 改成正式公开的实现仓库链接。
- **视频**：在 `resources.demos` 对应记录中填写 `videoUrl`（直接可播放的 MP4/WebM）或 `embedUrl`（YouTube、Bilibili 等播放器的嵌入地址）。二者同时填写时优先使用 `videoUrl`。`poster` 可填封面地址。

已接入 `public/dataset/devhound.zip`，原压缩包保持不变。资源区的主下载按钮与各数据项入口下载同一个完整 ZIP。包内包含 `qa_eval.jsonl` 与 `qa_gold.jsonl`（各 200 条），以及 10 位参与者的解释适配评分、认知水平标注和评估/标注工具材料。网页资源列表按当前包内实际内容展示。

已接入 `public/videos/过程知识沉淀.mp4`（记忆构建，约 1 分 41 秒）和 `public/videos/问答.mp4`（仓库问答，约 30 秒），保留原文件名。播放器提供原生播放控件，按需加载视频元数据，支持手机端页内播放；封面分别来自第 2 秒的开发轨迹画面和第 15 秒的问答画面。替换同名视频时，也应同步更新对应封面。

示例：

```ts
dataset: 'https://github.com/DevHound2027/DevHound/releases/download/v1/dataset.zip',
// 在相应 demos 记录中填写：
videoUrl: assetUrl('videos/memory-construction.mp4'),
embedUrl: null,
poster: assetUrl('videos/memory-construction-poster.webp'),
```

示例 URL 只说明配置格式，不表示资源已发布。体积较大的视频建议使用外部播放器或专门的视频存储。

## 内容来源与数据边界

- 论文标题：`main.tex`。
- 方法与术语：`sections/00-abstract.tex`、`01-introduction.tex`、`03-approach.tex`。Rationale Memory 提供历史决策证据；Developer Cognition Memory 仅调节逐知识点的解释深度。
- Kubernetes 示例：`sections/02-background-motivation.tex` 和 `figures/motivation.pdf`。网页的三种解释是用于阅读的改写示例，不是实时运行的智能体输出。
- 研究规模与数据集说明：`sections/04-evaluation.tex`。
- 交互图与数据表：从 `sections/05-results.tex` 的 RQ1 主结果表转录，KAC 为 0–10 分。网页标注其为当前论文报告值；未在网站中重新运行实验。
- 根据论文作者本轮确认，全部实验数值均为最终数据。RQ2 和 RQ3 的数值与结论按 `sections/05-results.tex` 展示；RQ2 评分分布图来自 `figures/rq2-answer-fit-half.pdf`。
- 方法图和实验流程图：分别从 `figures/Approach.pdf`、`figures/experiment-workflow.pdf` 转为 WebP。论文原文件未修改。

运行 `npm run build` 检查类型并构建。发布前更新论文副本，核对结果状态，填写已实际发布的资源链接。

## 中英双语

右上角 `EN / 中文` 切换覆盖导航、正文、图表标签、数据表、资源状态及无障碍说明，并保留当前选择的模型、指标和示例级别。语言偏好会保存在当前浏览器；链接参数 `?lang=en` 或 `?lang=zh` 可指定打开时的语言。

论文原图和 PDF 保留原文。中文文案集中在 `src/locales/zh.json`，英文文案保留在页面及内容配置中；新增内容时同步加入对应中文翻译。
