# AI 学习同步助手 📚📱

一个纯静态、免后端的跨设备 AI 学习应用：

- **电脑**：阅读学习六讲 AI 入门课程、做笔记、标记进度
- **手机**：预习下一课要点 + 基于 SM-2 记忆算法的复习卡片
- **同步**：通过 GitHub 私有 Gist 云同步学习进度（也可以用文件导出/导入）
- **PWA**：手机浏览器「添加到主屏幕」即可像 App 一样使用，支持离线

借鉴了 GitHub 上 [open-spaced-repetition](https://github.com/open-spaced-repetition/awesome-fsrs)（FSRS 间隔重复算法生态）与 [skola](https://github.com/h16nning/skola)（local-first 复习 PWA）的思路，算法采用经典 SM-2 简化实现，纯 vanilla JS，无任何构建步骤。

## 本地运行

```bash
cd ai-learning-app
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

> 注意：直接双击 index.html 无法注册 Service Worker，请用本地服务器打开。

## 发布为公开网页（GitHub Pages）

1. 在 GitHub 上新建一个**公开**仓库（例如 `ai-learning-app`）
2. 执行：

```bash
cd ai-learning-app
git init
git add .
git commit -m "AI 学习同步助手"
git branch -M main
git remote add origin https://github.com/<你的用户名>/ai-learning-app.git
git push -u origin main
```

3. 仓库页面 → Settings → Pages → Source 选 `main` 分支 / `(root)` → Save
4. 一分钟后访问 `https://<你的用户名>.github.io/ai-learning-app/`

手机浏览器打开同一网址 → 菜单 →「添加到主屏幕」。

## 跨设备同步配置

1. 打开 https://github.com/settings/tokens 创建 Token：
   - 推荐 **Fine-grained token**：仓库权限选 "All repositories" 不需要，只需在 **Account permissions → Gists** 设为 Read and write
   - 或经典 token：仅勾选 `gist` 一项
2. 在**电脑和手机**的「我的」页都填入同一个 Token
3. 电脑端点「⬆ 上传到云端」→ 自动创建私有 Gist 并记住 Gist ID
4. 手机端把该 **Gist ID** 也填上 → 点「⬇ 从云端拉取」即可拿到进度

Token 只保存在各自设备浏览器的 localStorage 中，不会进入云端数据。

## 目录结构

```
index.html            页面骨架
css/style.css         样式（响应式，≤860px 切换为手机底部导航布局）
js/data.js            内置六讲课程内容 + 复习卡片
js/app.js             学习/预习/复习/统计/同步逻辑
sw.js + manifest      PWA 离线与安装支持
```

## 自定义课程

编辑 `js/data.js`，向 `COURSES` 数组增删课程即可，每课包含 `preview`（预习要点）、`content`（正文 HTML）、`cards`（问答卡片），卡片 ID 由 `课程id:序号` 自动生成，复习排期自动生效。
