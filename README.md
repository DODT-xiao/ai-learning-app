# AI 学习同步助手 📚📱

一个纯静态、免后端的**个性化 AI 职场学习应用**：

- **能力测评**：10 道选择题定位「互联网基础 / AI 原理 / AI 应用」三维度水平
- **个性化推荐**：按测评结果给每课标记 🔥必修 / 📖建议 / 💤可跳过，课程排序自动调整
- **职场向课程**：10 讲——网页应用原理（前后端/数据库/API）、大模型原理、提示词工程、Vibe Coding 正确姿势、AI 办公自动化、API、RAG、Agent、数据安全、学习路线图
- **电脑学习 / 手机预习复习**：响应式布局，手机端预习要点 + SM-2 间隔复习闪卡
- **云同步**：进度存 GitHub 私有 Gist，多设备同步；也支持文件导出/导入
- **PWA**：添加到主屏幕即可像 App 使用，支持离线

课程体系参考了 [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners)、[mlabonne/llm-course](https://github.com/mlabonne/llm-course)（基础可跳过的设计）与 [roadmap.sh/ai-engineer](https://roadmap.sh/ai-engineer)（面向 AI 应用者）。

## 本地运行

```bash
cd ai-learning-app
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 发布 / 更新（GitHub Pages）

改动后推送到 main 分支即自动重新部署：

```bash
git add . && git commit -m "update" && git push
```

线上地址：`https://<用户名>.github.io/ai-learning-app/`

> 注意：更新 sw.js 时要同步修改 `CACHE = "ai-learn-vN"` 版本号，手机端才能拿到新资源。

## 跨设备同步配置

1. 创建 Fine-grained Token：Repository access 选 All repositories；**Account permissions → Gists → Read and write**（注意 Gists 属于 Account 权限）
2. 电脑端「我的」→ 填 Token → ⬆ 上传到云端（自动创建私有 Gist）
3. 手机端填同一 Token + 同一 Gist ID → ⬇ 从云端拉取
4. 习惯：电脑学完就上传；手机复习前先拉取

## 目录结构

```
index.html            页面骨架
css/style.css         响应式样式（≤860px 切换手机底部导航）
js/data.js            课程数据 + 测评题目（改这里就能加课程/改题）
js/app.js             测评/推荐/学习/预习/复习/同步逻辑
sw.js + manifest      PWA 离线缓存与安装
```

## 自定义

- **加课程**：在 `js/data.js` 的 `COURSES` 数组追加，含 `module/preview/why/content/cards`；如需被测评映射，在 `QUIZ` 对应题的 `map` 里加课程 id
- **改测评**：编辑 `QUIZ` 数组，每题 `dim` 为所属维度，`map` 为答对后可跳过的课程
- **卡片复习排期**：SM-2 简化版，忘记→10 分钟，记住→间隔 ×1 →×3 →×ease
