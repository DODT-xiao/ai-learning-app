/* AI 学习同步助手 - 主逻辑
 * 数据结构：
 *   state.courses[courseId] = { read, completed, previewed, notes }
 *   state.cards[cardId]     = { ease, interval(天), reps, due(时间戳) }
 *   state.activity[dateStr] = 复习张数
 *   state.updatedAt         = 最后修改时间（用于同步冲突判断）
 */
(function () {
  "use strict";

  const LS_STATE = "aiLearnState";
  const LS_TOKEN = "aiLearnToken";
  const LS_GIST = "aiLearnGistId";
  const SYNC_FILE = "ai-learning-data.json";
  const NEW_PER_DAY = 15;

  /* ---------------- 状态 ---------------- */
  function defaultState() {
    return { version: 1, courses: {}, cards: {}, activity: {}, updatedAt: 0 };
  }
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_STATE));
      if (s && s.version === 1) return s;
    } catch (e) { /* ignore */ }
    return defaultState();
  }
  let state = loadState();
  function save() {
    state.updatedAt = Date.now();
    localStorage.setItem(LS_STATE, JSON.stringify(state));
    renderOverview();
  }
  function courseState(id) {
    if (!state.courses[id]) state.courses[id] = { read: false, completed: false, previewed: false, notes: "" };
    return state.courses[id];
  }
  function cardState(id) {
    if (!state.cards[id]) state.cards[id] = { ease: 2.5, interval: 0, reps: 0, due: 0 };
    return state.cards[id];
  }
  function todayStr(d) {
    const t = d || new Date();
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }

  /* ---------------- SRS (SM-2 简化版) ---------------- */
  function grade(cardId, q) {
    const c = cardState(cardId);
    // q: 0=忘了, 4=想起来了, 5=轻松
    if (q < 3) {
      c.reps = 0;
      c.interval = 10 / (60 * 24); // 10 分钟后重来
      c.ease = Math.max(1.3, c.ease - 0.2);
    } else {
      if (c.reps === 0) c.interval = 1;
      else if (c.reps === 1) c.interval = 3;
      else c.interval = Math.round(c.interval * c.ease);
      c.reps += 1;
      c.ease = Math.max(1.3, c.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    }
    c.due = Date.now() + c.interval * 24 * 3600 * 1000;
    const t = todayStr();
    state.activity[t] = (state.activity[t] || 0) + 1;
    save();
  }
  function allCards() {
    const list = [];
    COURSES.forEach(c => c.cards.forEach((cd, i) => list.push({ id: c.id + ":" + i, courseId: c.id, q: cd.q, a: cd.a })));
    return list;
  }
  const CARDS = allCards();
  function dueCards() {
    const now = Date.now();
    return CARDS.filter(c => {
      const s = state.cards[c.id];
      return s && s.due > 0 && s.due <= now;
    }).sort((a, b) => state.cards[a.id].due - state.cards[b.id].due);
  }
  function newCards(limit) {
    return CARDS.filter(c => !state.cards[c.id]).slice(0, limit);
  }
  function streakDays() {
    let n = 0;
    const d = new Date();
    // 今天没学不打断连续天数（以昨天为起点回溯）
    if (!state.activity[todayStr(d)]) d.setDate(d.getDate() - 1);
    while (state.activity[todayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------------- 工具 ---------------- */
  const $ = sel => document.querySelector(sel);
  function toast(msg, ms) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add("hidden"), ms || 2400);
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  const TAB_NAMES = { learn: "学习", preview: "预习", review: "复习", me: "我的" };
  let currentTab = "learn";
  let reviewQueue = null; // 当前复习会话队列
  let currentCard = null;
  let revealed = false;

  /* ---------------- 标签页 ---------------- */
  function switchTab(name) {
    currentTab = name;
    document.querySelectorAll("#view-learn,#view-preview,#view-review,#view-me").forEach(el => el.classList.add("hidden"));
    $("#view-" + name).classList.remove("hidden");
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    if (name === "learn") renderLearn();
    if (name === "preview") renderPreview();
    if (name === "review") renderReview();
    if (name === "me") renderMe();
    renderOverview();
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  /* ---------------- 学习页 ---------------- */
  function renderLearn() {
    const doneCount = COURSES.filter(c => courseState(c.id).completed).length;
    const pct = Math.round(doneCount / COURSES.length * 100);
    let html = `
      <div class="card">
        <h2>AI 入门六讲</h2>
        <p class="muted">电脑上阅读学习，手机上预习和复习。点击课程展开正文。</p>
        <div class="progressbar"><div style="width:${pct}%"></div></div>
        <p class="muted">总进度：${doneCount} / ${COURSES.length} 课（${pct}%）</p>
      </div>`;
    COURSES.forEach((c, i) => {
      const cs = courseState(c.id);
      const tag = cs.completed ? '<span class="tag done">已学完</span>' : (cs.read ? '<span class="tag part">学习中</span>' : "");
      html += `
        <div class="card course-item ${cs.completed ? "done" : ""}" data-course="${c.id}">
          <div class="course-head" data-action="toggle" data-id="${c.id}">
            <div class="num">${i + 1}</div>
            <div class="t"><b>${esc(c.title)}${tag}</b><span>${esc(c.subtitle)}</span></div>
            <div class="arrow">▶</div>
          </div>
          <div class="course-body">
            ${c.content}
            <label class="field">我的笔记<span class="tip">（自动保存，随云端同步）</span></label>
            <textarea rows="3" data-action="notes" data-id="${c.id}" placeholder="写下你的理解、疑问或例子…">${esc(cs.notes || "")}</textarea>
            <div class="btn-row">
              <button class="btn ${cs.completed ? "ghost" : ""}" data-action="complete" data-id="${c.id}">${cs.completed ? "✓ 已学完（点击取消）" : "标记本课学完"}</button>
            </div>
          </div>
        </div>`;
    });
    $("#view-learn").innerHTML = html;
  }

  /* ---------------- 预习页 ---------------- */
  function renderPreview() {
    const next = COURSES.find(c => !courseState(c.id).completed);
    let html = "";
    if (next) {
      const cs = courseState(next.id);
      html += `
        <div class="card">
          <h2>🔭 下一课预习：${esc(next.title)}</h2>
          <p class="muted">${esc(next.subtitle)}</p>
          <div class="why-box">💡 <b>为什么值得预习：</b>${esc(next.why)}</div>
          <ul class="preview-points">
            ${next.preview.map(p => `<li>${esc(p)}</li>`).join("")}
          </ul>
          <p class="muted">带着这些问题去读正文，比直接硬读效率高得多。预习完可以在「学习」页阅读本课正文。</p>
          <div class="btn-row">
            <button class="btn ${cs.previewed ? "ghost" : ""}" data-action="previewed" data-id="${next.id}">${cs.previewed ? "✓ 已预习（点击取消）" : "标记本课已预习"}</button>
            <button class="btn ghost" data-action="gotoLearn" data-id="${next.id}">去学习本课 →</button>
          </div>
        </div>`;
    } else {
      html += `<div class="card empty"><span class="big">🎉</span>全部课程已学完！可以用「复习」巩固，或期待后续新课程。</div>`;
    }
    html += `<div class="card"><h2>全部课程预习要点</h2>`;
    COURSES.forEach((c, i) => {
      const cs = courseState(c.id);
      html += `
        <details ${c.id === (next && next.id) ? "open" : ""}>
          <summary style="cursor:pointer;padding:8px 0;font-weight:600;">第 ${i + 1} 课 · ${esc(c.title)} ${cs.previewed ? '<span class="tag done">已预习</span>' : ""}</summary>
          <ul class="preview-points">${c.preview.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        </details>`;
    });
    html += `</div>`;
    $("#view-preview").innerHTML = html;
  }

  /* ---------------- 复习页 ---------------- */
  function renderReview() {
    if (!reviewQueue) {
      const due = dueCards();
      const fresh = newCards(NEW_PER_DAY);
      reviewQueue = due.concat(fresh);
    }
    if (reviewQueue.length === 0) {
      reviewQueue = null;
      const total = CARDS.length;
      const learned = CARDS.filter(c => state.cards[c.id]).length;
      const dueTomorrow = CARDS.filter(c => {
        const s = state.cards[c.id];
        return s && s.due > Date.now() && s.due < Date.now() + 24 * 3600 * 1000;
      }).length;
      $("#view-review").innerHTML = `
        <div class="card empty">
          <span class="big">🌿</span>
          <b>今天的复习任务全部完成！</b>
          <p class="muted">已学卡片 ${learned} / ${total} · 24 小时内还有 ${dueTomorrow} 张到期。<br>复习讲求少而勤，明天再来效果最好。</p>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn ghost" data-action="forceReview">再练 5 张（加练）</button>
          </div>
        </div>`;
      updateBadge();
      return;
    }
    currentCard = reviewQueue[0];
    const cs = courseState(currentCard.courseId);
    const course = COURSES.find(c => c.id === currentCard.courseId);
    const s = state.cards[currentCard.id];
    const isNew = !s;
    revealed = false;
    $("#view-review").innerHTML = `
      <div class="card">
        <p class="muted" style="margin:0;">剩余 ${reviewQueue.length} 张${isNew ? " · 新卡片" : ""} · 来自《${esc(course.title)}》</p>
        <div class="flashcard" id="flashcard">
          <div class="q">${esc(currentCard.q)}</div>
          <div class="a hidden" id="answer">${esc(currentCard.a)}</div>
          <div class="meta">${isNew ? "新卡片，第一次见面" : "间隔 " + (s.interval >= 1 ? s.interval + " 天" : "10 分钟")}</div>
        </div>
        <div class="btn-row" id="revealRow" style="justify-content:center;">
          <button class="btn" data-action="reveal">👀 想好了，看答案</button>
        </div>
        <div class="rate-row hidden" id="rateRow">
          <button class="btn danger" data-action="grade" data-q="0">😱 忘了<br><span style="font-size:.72rem;font-weight:400;">10 分钟后再来</span></button>
          <button class="btn warn" data-action="grade" data-q="4">🙂 想起来了<br><span style="font-size:.72rem;font-weight:400;">隔 ${Math.max(1, s ? Math.round(s.interval * s.ease) : 1)} 天</span></button>
          <button class="btn ok" data-action="grade" data-q="5">😄 很轻松<br><span style="font-size:.72rem;font-weight:400;">隔更久</span></button>
        </div>
      </div>`;
    updateBadge();
  }

  function updateBadge() {
    const n = dueCards().length;
    const badge = $("#dueBadge");
    if (n > 0) { badge.textContent = n; badge.classList.remove("hidden"); }
    else badge.classList.add("hidden");
  }

  /* ---------------- 我的页 ---------------- */
  function renderMe() {
    const learned = CARDS.filter(c => state.cards[c.id]).length;
    const mature = CARDS.filter(c => { const s = state.cards[c.id]; return s && s.interval >= 21; }).length;
    const reviews = Object.values(state.activity).reduce((a, b) => a + b, 0);
    const doneCount = COURSES.filter(c => courseState(c.id).completed).length;
    const token = localStorage.getItem(LS_TOKEN) || "";
    const gist = localStorage.getItem(LS_GIST) || "";
    $("#view-me").innerHTML = `
      <div class="card">
        <h2>学习统计</h2>
        <div class="stat-grid">
          <div class="stat"><b>${doneCount}/${COURSES.length}</b><span>课程进度</span></div>
          <div class="stat"><b>${learned}</b><span>已学卡片</span></div>
          <div class="stat"><b>${mature}</b><span>牢固掌握</span></div>
          <div class="stat"><b>${reviews}</b><span>累计复习次数</span></div>
          <div class="stat"><b>${streakDays()}</b><span>连续学习天数</span></div>
        </div>
      </div>
      <div class="card">
        <h2>跨设备同步（GitHub 云端）</h2>
        <p class="muted">在电脑和手机上都填入同一个 GitHub Token，即可把学习进度同步到你的 GitHub 私有 Gist。Token 只保存在本机浏览器里，不会同步给他人。</p>
        <label class="field">GitHub Token <span class="tip">建议用 fine-grained token，仅勾选 Gists 权限</span></label>
        <input type="password" id="tokenInput" value="${esc(token)}" placeholder="ghp_… / github_pat_…" />
        <label class="field">Gist ID <span class="tip">第一次上传后会自动生成并填回，两台设备填同一个</span></label>
        <input type="text" id="gistInput" value="${esc(gist)}" placeholder="留空则首次上传时自动创建私有 Gist" />
        <div class="btn-row">
          <button class="btn" data-action="saveSync">保存同步配置</button>
          <button class="btn ok" data-action="push">⬆ 上传到云端</button>
          <button class="btn ghost" data-action="pull">⬇ 从云端拉取</button>
        </div>
        <p class="muted" style="margin-top:10px;">没有 GitHub 账号？也可以用下面的文件导入导出手工同步。</p>
        <div class="btn-row">
          <button class="btn ghost" data-action="export">📤 导出进度文件</button>
          <button class="btn ghost" data-action="import">📥 导入进度文件</button>
          <input type="file" id="importFile" accept=".json" class="hidden" />
        </div>
      </div>
      <div class="card">
        <h2>使用小贴士</h2>
        <ul>
          <li>📱 手机浏览器打开本页后，选择「添加到主屏幕」，即可像 App一样全屏使用。</li>
          <li>🧠 复习卡片基于 SM-2 记忆算法自动排期：忘记的 10 分钟后重现，记住的间隔逐次拉长。</li>
          <li>✍️ 每课笔记自动保存在本地，并随同步上传。</li>
        </ul>
      </div>`;
  }

  /* ---------------- 侧栏概览 ---------------- */
  function renderOverview() {
    const due = dueCards().length;
    const next = COURSES.find(c => !courseState(c.id).completed);
    const done = COURSES.filter(c => courseState(c.id).completed).length;
    const today = state.activity[todayStr()] || 0;
    const el = $("#overview");
    if (el) el.innerHTML = `
      <div class="overview-row"><span>🧠 待复习</span><b>${due} 张</b></div>
      <div class="overview-row"><span>📖 课程进度</span><b>${done}/${COURSES.length}</b></div>
      <div class="overview-row"><span>🔭 下一课</span><b>${next ? esc(next.title) : "已完成 🎉"}</b></div>
      <div class="overview-row"><span>🔥 今日已复习</span><b>${today} 张</b></div>
      <div class="overview-row"><span>⚡ 连续学习</span><b>${streakDays()} 天</b></div>
      <div class="btn-row"><button class="btn sm ${due > 0 ? "" : "ghost"}" data-action="goReview">${due > 0 ? "开始复习 →" : "复习已完成"}</button></div>`;
    const st = $("#syncStatus");
    if (st) {
      const gist = localStorage.getItem(LS_GIST);
      st.innerHTML = state.syncedAt
        ? `☁️ 上次同步：${new Date(state.syncedAt).toLocaleString()}${gist ? "" : "（注意：尚未保存 Gist ID）"}`
        : "☁️ 尚未云同步 · 可在「我的」页配置，或使用文件导出/导入。";
    }
    updateBadge();
  }

  /* ---------------- 云同步（GitHub Gist） ---------------- */
  async function gh(method, url, bodyObj) {
    const token = localStorage.getItem(LS_TOKEN);
    const headers = { Accept: "application/vnd.github+json", "Content-Type": "application/json" };
    if (token) headers.Authorization = "Bearer " + token;
    const res = await fetch(url, { method, headers, body: bodyObj ? JSON.stringify(bodyObj) : undefined });
    if (!res.ok) {
      let msg = "HTTP " + res.status;
      if (res.status === 401) msg = "Token 无效或已过期（401）";
      else if (res.status === 403) msg = "权限不足或触发限流（403），请检查 token 是否勾选了 Gists 权限";
      else if (res.status === 404) msg = "找不到该 Gist（404），请检查 Gist ID";
      throw new Error(msg);
    }
    return res.json();
  }
  function syncPayload() {
    // token 不入云端数据
    return JSON.stringify(state);
  }
  async function pushSync() {
    try {
      toast("正在上传…", 8000);
      const gistId = localStorage.getItem(LS_GIST);
      const content = syncPayload();
      if (gistId) {
        await gh("PATCH", "https://api.github.com/gists/" + gistId, { files: { [SYNC_FILE]: { content } } });
      } else {
        const j = await gh("POST", "https://api.github.com/gists", {
          description: "AI 学习同步助手 - 学习进度（自动同步）",
          files: { [SYNC_FILE]: { content } },
          public: false
        });
        localStorage.setItem(LS_GIST, j.id);
        toast("已创建私有 Gist：" + j.id + "（请把同一 Gist ID 填到另一台设备）", 5000);
      }
      state.syncedAt = Date.now();
      save();
      renderMe();
    } catch (e) {
      toast("上传失败：" + e.message, 5000);
    }
  }
  async function pullSync() {
    try {
      const gistId = localStorage.getItem(LS_GIST);
      if (!gistId) return toast("还没有 Gist ID，请先在电脑端上传一次", 4000);
      toast("正在拉取…", 8000);
      const j = await gh("GET", "https://api.github.com/gists/" + gistId);
      const raw = j.files && j.files[SYNC_FILE] && j.files[SYNC_FILE].content;
      if (!raw) return toast("云端 Gist 里没有找到数据文件", 4000);
      const cloud = JSON.parse(raw);
      const cT = cloud.updatedAt || 0, lT = state.updatedAt || 0;
      if (lT > cT) {
        if (!confirm(`本机进度（${new Date(lT).toLocaleString()}）比云端（${new Date(cT).toLocaleString()}）更新，仍要用云端覆盖本机吗？`)) return;
      }
      const token = localStorage.getItem(LS_TOKEN); // token 只存本地
      state = cloud;
      state.version = 1;
      localStorage.setItem(LS_STATE, JSON.stringify(state));
      localStorage.setItem(LS_TOKEN, token || "");
      state.syncedAt = Date.now();
      save();
      reviewQueue = null;
      renderMe();
      toast("已从云端拉取进度 ✓");
    } catch (e) {
      toast("拉取失败：" + e.message, 5000);
    }
  }
  function exportFile() {
    const blob = new Blob([syncPayload()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ai-learning-progress-" + todayStr() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function importFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || data.version !== 1) throw new Error("文件格式不对");
        state = data;
        localStorage.setItem(LS_STATE, JSON.stringify(state));
        reviewQueue = null;
        renderMe();
        toast("导入成功 ✓");
      } catch (e) { toast("导入失败：" + e.message, 4000); }
    };
    reader.readAsText(file);
  }

  /* ---------------- 事件委托 ---------------- */
  document.addEventListener("click", ev => {
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === "toggle") {
      const item = btn.closest(".course-item");
      item.classList.toggle("open");
    } else if (action === "complete") {
      const cs = courseState(id);
      cs.completed = !cs.completed;
      if (cs.completed) cs.read = true;
      save();
      renderLearn();
      toast(cs.completed ? "本课已标记学完，去手机上复习对应卡片吧 📱" : "已取消完成标记");
    } else if (action === "previewed") {
      const cs = courseState(id);
      cs.previewed = !cs.previewed;
      save();
      renderPreview();
    } else if (action === "gotoLearn") {
      switchTab("learn");
      const item = document.querySelector(`.course-item[data-course="${id}"]`);
      if (item) { item.classList.add("open"); item.scrollIntoView({ behavior: "smooth", block: "start" }); }
    } else if (action === "reveal") {
      $("#answer").classList.remove("hidden");
      $("#revealRow").classList.add("hidden");
      $("#rateRow").classList.remove("hidden");
      revealed = true;
    } else if (action === "grade") {
      if (!currentCard) return;
      grade(currentCard.id, parseInt(btn.dataset.q, 10));
      reviewQueue.shift();
      renderReview();
    } else if (action === "forceReview") {
      reviewQueue = newCards(5).concat(CARDS.filter(c => state.cards[c.id]).sort(() => Math.random() - 0.5).slice(0, 5));
      renderReview();
    } else if (action === "goReview") {
      reviewQueue = null;
      switchTab("review");
    } else if (action === "saveSync") {
      const t = $("#tokenInput").value.trim();
      const g = $("#gistInput").value.trim();
      localStorage.setItem(LS_TOKEN, t);
      if (g) localStorage.setItem(LS_GIST, g);
      toast("同步配置已保存 ✓");
      renderOverview();
    } else if (action === "push") {
      const t = $("#tokenInput").value.trim();
      const g = $("#gistInput").value.trim();
      localStorage.setItem(LS_TOKEN, t);
      if (g) localStorage.setItem(LS_GIST, g);
      if (!t) return toast("请先填写 GitHub Token", 3500);
      pushSync();
    } else if (action === "pull") {
      const t = $("#tokenInput").value.trim();
      const g = $("#gistInput").value.trim();
      localStorage.setItem(LS_TOKEN, t);
      if (g) localStorage.setItem(LS_GIST, g);
      pullSync();
    } else if (action === "export") {
      exportFile();
    } else if (action === "import") {
      $("#importFile").click();
    }
  });
  document.addEventListener("change", ev => {
    if (ev.target && ev.target.id === "importFile" && ev.target.files[0]) {
      importFile(ev.target.files[0]);
    }
  });
  document.addEventListener("input", ev => {
    if (ev.target && ev.target.dataset && ev.target.dataset.action === "notes") {
      const cs = courseState(ev.target.dataset.id);
      cs.notes = ev.target.value;
      clearTimeout(window.__noteTimer);
      window.__noteTimer = setTimeout(save, 800);
    }
  });

  /* ---------------- PWA ---------------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./sw.js").catch(() => { });
  }

  /* ---------------- 启动 ---------------- */
  renderOverview();
  switchTab("learn");
})();
