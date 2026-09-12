/* AI 学习同步助手 - 主逻辑 v2
 * 数据结构：
 *   state.version          = 2
 *   state.assessment       = { date, answers:{qid:选项}, scores:{web,ai,app,total}, recs:{courseId:'skip'|'must'|'rec'} }
 *   state.courses[courseId]= { read, completed, previewed, notes }
 *   state.cards[cardId]    = { ease, interval(天), reps, due(时间戳) }
 *   state.activity[dateStr]= 复习张数
 */
(function () {
  "use strict";

  const LS_STATE = "aiLearnState";
  const LS_TOKEN = "aiLearnToken";
  const LS_GIST = "aiLearnGistId";
  const SYNC_FILE = "ai-learning-data.json";
  const NEW_PER_DAY = 15;

  /* ---------------- 状态与迁移 ---------------- */
  function defaultState() {
    return { version: 2, assessment: null, courses: {}, cards: {}, activity: {}, updatedAt: 0 };
  }
  function loadState() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(LS_STATE)); } catch (e) { /* ignore */ }
    if (!s || typeof s !== "object") return defaultState();
    if (s.version !== 2) {
      // v1 -> v2：课程与卡片体系升级，保留学习活动记录
      s = {
        version: 2,
        assessment: null,
        courses: {}, cards: {},
        activity: s.activity || {},
        updatedAt: s.updatedAt || 0,
        syncedAt: s.syncedAt || 0
      };
      localStorage.setItem(LS_STATE, JSON.stringify(s));
      setTimeout(() => toast("课程体系已升级到 v2，请先做能力测评 📋", 4500), 800);
    }
    return s;
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
    if (!state.activity[todayStr(d)]) d.setDate(d.getDate() - 1);
    while (state.activity[todayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------------- 能力测评与推荐 ---------------- */
  function computeAssessment(answers) {
    const scores = { web: 0, ai: 0, app: 0 };
    const dimTotal = { web: 0, ai: 0, app: 0 };
    const skipCourses = new Set();
    QUIZ.forEach(q => {
      dimTotal[q.dim]++;
      if (answers[q.id] === q.answer) {
        scores[q.dim]++;
        (q.map || []).forEach(c => skipCourses.add(c));
      }
    });
    scores.total = scores.web + scores.ai + scores.app;
    // 推荐规则：题目答对 → 直接映射课程可跳过；未覆盖到的课按维度分数给建议
    const recs = {};
    COURSES.forEach(c => {
      if (skipCourses.has(c.id)) recs[c.id] = "skip";
      else recs[c.id] = "must";
    });
    // 未被任何题目覆盖的课程：维度满分时降为"建议"
    const covered = new Set();
    QUIZ.forEach(q => (q.map || []).forEach(cid => covered.add(cid)));
    COURSES.forEach(c => {
      if (!covered.has(c.id) && recs[c.id] === "must") recs[c.id] = "rec";
    });
    // 提示词课（c3）：只有三项全对才可跳过
    if (scores.total === QUIZ.length) recs["c3"] = "skip";
    else if (!covered.has("c3")) recs["c3"] = "rec";
    if (state.assessment && recs["c3"] !== "skip") { /* 保持计算结果 */ }
    return { date: Date.now(), answers, scores, recs, dimTotal };
  }
  function recLabel(tag) {
    return { must: '<span class="tag must">🔥 必修</span>', rec: '<span class="tag rec">📖 建议</span>', skip: '<span class="tag skip">💤 可跳过</span>' }[tag] || "";
  }
  // 学习顺序：必修 → 建议 → 可跳过（同级保持原顺序）
  function orderedCourses() {
    const rank = { must: 0, rec: 1, skip: 2 };
    const recs = state.assessment ? state.assessment.recs : null;
    if (!recs) return COURSES.slice();
    return COURSES.slice().sort((a, b) => (rank[recs[a.id]] ?? 1) - (rank[recs[b.id]] ?? 1));
  }
  function nextCourse() {
    return orderedCourses().find(c => !courseState(c.id).completed);
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
  let currentTab = "learn";
  let reviewQueue = null;
  let currentCard = null;
  let quizActive = false;   // 正在测评
  let quizIdx = 0;
  let quizAnswers = {};
  const openCourses = new Set();   // 学习页展开的课程

  /* ------- 伴学助手：术语即点即释 + 划选解释 ------- */
  function wrapGlossary(root) {
    if (!root || !root.querySelectorAll) return;
    const items = GLOSSARY.slice().sort((a, b) => b.term.length - a.term.length);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => {
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest(".term, script, style, pre, textarea, button, svg")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      for (const g of items) {
        let lower = text.toLowerCase(), idx = lower.indexOf(g.term.toLowerCase());
        while (idx !== -1) {
          const frag = document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(0, idx)));
          const span = document.createElement("span");
          span.className = "term";
          span.dataset.term = g.term;
          span.textContent = text.slice(idx, idx + g.term.length);
          frag.appendChild(span);
          node.parentNode.insertBefore(frag, node);
          text = text.slice(idx + g.term.length);
          node.nodeValue = text;
          lower = text.toLowerCase();
          idx = lower.indexOf(g.term.toLowerCase());
        }
      }
    });
  }
  function showCompanion(html) {
    let el = $("#companion");
    if (!el) {
      el = document.createElement("div");
      el.id = "companion";
      document.body.appendChild(el);
    }
    el.innerHTML = html + '<button class="companion-close" data-action="closeCompanion">✕</button>';
    el.classList.remove("hidden");
  }
  function showTerm(term) {
    const g = GLOSSARY.find(x => x.term === term);
    if (!g) return;
    showCompanion(`<div class="cp-term">📖 ${esc(g.term)}</div><div class="cp-body">${esc(g.plain)}</div>`);
  }
  function explainSelection() {
    let sel = "";
    const s = window.getSelection ? window.getSelection() : null;
    if (s && s.rangeCount && !s.isCollapsed) sel = rangeText(s.getRangeAt(0));
    if (!sel) sel = lastSelText;
    if (!sel || !sel.trim()) return toast("请先在正文里选中一段看不懂的话", 3000);
    const lower = sel.toLowerCase();
    const hits = GLOSSARY.filter(g => lower.includes(g.term.toLowerCase())).slice(0, 3);
    let html = `<div class="cp-term">🤖 伴学助手</div><div class="cp-quote">「${esc(sel.length > 120 ? sel.slice(0, 120) + "…" : sel)}」</div>`;
    if (hits.length) {
      html += hits.map(g => `<div class="cp-hit"><b>📖 ${esc(g.term)}</b>${esc(g.plain)}</div>`).join("");
    } else {
      html += `<div class="cp-body">这段话里没有命中内置术语。把它拆开看：先找出不懂的关键词（可以点击页面里带虚线的词）；或者复制下面的提问模板，发给 ChatGPT/豆包等任意 AI 继续追问：</div>
        <div class="cp-tpl">请用初中生能听懂的语言，解释下面这段我正在学的内容，并举一个生活中的例子：\n「${esc(sel.length > 300 ? sel.slice(0, 300) + "…" : sel)}」</div>
        <div class="btn-row"><button class="btn sm" data-action="copyTpl">📋 复制提问模板</button></div>`;
    }
    showCompanion(html);
  }
  function openGlossary() {
    showCompanion(`<div class="cp-term">📖 术语速查（点词即释）</div><input type="text" id="glossSearch" placeholder="搜索术语，如：RAG、幻觉、API…" />
      <div class="cp-list" id="glossList"></div>`);
    const render = kw => {
      const list = GLOSSARY.filter(g => !kw || g.term.toLowerCase().includes(kw.toLowerCase()));
      $("#glossList").innerHTML = list.map(g => `<details><summary>${esc(g.term)}</summary><div class="cp-body">${esc(g.plain)}</div></details>`).join("") || '<p class="muted">没有找到，换个词试试</p>';
    };
    render("");
    $("#glossSearch").addEventListener("input", e => render(e.target.value.trim()));
  }

  /* ---------------- 标签页 ---------------- */
  function switchTab(name) {
    currentTab = name;
    if (name !== "learn") quizActive = false;
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

  /* ---------------- 测评 ---------------- */
  function startQuiz() {
    quizActive = true;
    quizIdx = 0;
    quizAnswers = {};
    renderQuiz();
  }
  function renderQuiz() {
    if (quizIdx >= QUIZ.length) {
      state.assessment = computeAssessment(quizAnswers);
      quizActive = false;
      save();
      renderLearn();
      const s = state.assessment.scores;
      toast(`测评完成！你的水平：${levelName(s.total)}（答对 ${s.total}/${QUIZ.length}）`, 5000);
      window.scrollTo({ top: 0 });
      return;
    }
    const q = QUIZ[quizIdx];
    $("#view-learn").innerHTML = `
      <div class="card">
        <h2>📋 能力测评（第 ${quizIdx + 1} / ${QUIZ.length} 题）</h2>
        <div class="progressbar"><div style="width:${quizIdx / QUIZ.length * 100}%"></div></div>
        <p class="muted">10 道选择题，答不上来就选「不确定」——测评的目的是帮你跳过已会的、聚焦需要的，诚实作答效果最好。</p>
        <div class="quiz-q">${esc(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `<button class="quiz-opt" data-action="quizPick" data-opt="${i}">${esc(opt)}</button>`).join("")}
        </div>
      </div>`;
  }
  function levelName(total) {
    if (total <= 3) return "L1 起步者";
    if (total <= 6) return "L2 进阶者";
    if (total <= 8) return "L3 应用者";
    return "L4 高手（大部分课可跳过）";
  }
  function renderQuizResult() {
    const a = state.assessment;
    const s = a.scores;
    const bar = (label, val, max) => `
      <div class="score-row"><span>${label}</span>
        <div class="score-bar"><div style="width:${max ? val / max * 100 : 0}%"></div></div>
        <b>${val}/${max}</b></div>`;
    return `
      <div class="card result-card">
        <h2>🎯 测评结果：${levelName(s.total)}</h2>
        <p class="muted">测评时间：${new Date(a.date).toLocaleDateString()} · 共答对 ${s.total}/${QUIZ.length}</p>
        ${bar("🌐 互联网基础", s.web, a.dimTotal.web)}
        ${bar("🤖 AI 原理", s.ai, a.dimTotal.ai)}
        ${bar("💼 AI 应用与职场", s.app, a.dimTotal.app)}
        <div class="why-box">📌 课程已按你的水平标记：<b>🔥 必修</b>（你需要学的）、<b>📖 建议</b>、<b>💤 可跳过</b>（你已掌握的）。建议从「学习」页的第一门必修课开始。</div>
        <div class="btn-row">
          <button class="btn" data-action="startQuiz">🔄 重新测评</button>
        </div>
      </div>`;
  }

  /* ---------------- 学习页 ---------------- */
  function renderLearn() {
    if (quizActive) return renderQuiz();
    const recs = state.assessment && state.assessment.recs;
    let html = "";
    if (!state.assessment) {
      html += `
        <div class="card">
          <h2>👋 先花 2 分钟做个能力测评</h2>
          <p class="muted">10 道选择题，测出你在「互联网基础 / AI 原理 / AI 应用」三个维度的水平，自动为你标记每门课：必修 🔥 / 建议 📖 / 可跳过 💤——已经掌握的课就不用浪费时间了。</p>
          <div class="btn-row"><button class="btn" data-action="startQuiz">开始测评 →</button></div>
        </div>`;
    } else {
      html += renderQuizResult();
    }
    html += `
      <div class="card">
        <p class="muted" style="margin:0;">🤖 <b>伴学小贴士：</b>读正文时遇到带虚线的词（如 <span class="term" data-term="API">API</span>、<span class="term" data-term="幻觉">幻觉</span>），点一下就有通俗解释；选中任何看不懂的句子，点右下角「🔍 解释这句」；更多术语在右下角 <button class="btn sm ghost" data-action="openGlossary">📖 术语速查</button></p>
      </div>`;
    const list = orderedCourses();
    const doneCount = COURSES.filter(c => courseState(c.id).completed).length;
    const pct = Math.round(doneCount / COURSES.length * 100);
    let lastModule = "";
    html += `
      <div class="card">
        <h2>职场 AI 实战课（10 讲）</h2>
        <p class="muted">电脑上阅读学习，手机上预习和复习。点击课程展开正文。</p>
        <div class="progressbar"><div style="width:${pct}%"></div></div>
        <p class="muted">总进度：${doneCount} / ${COURSES.length} 课（${pct}%）${recs ? " · 排序已按你的测评结果调整" : ""}</p>
      </div>`;
    list.forEach(c => {
      const i = COURSES.indexOf(c) + 1;
      const cs = courseState(c.id);
      const tag = recs ? recLabel(recs[c.id]) : "";
      const doneTag = cs.completed ? '<span class="tag done">✓ 已学完</span>' : (cs.read ? '<span class="tag part">学习中</span>' : "");
      const quizTag = courseQuizPassed(c) ? '<span class="tag done">✓ 测验通过</span>' : "";
      if (c.module !== lastModule) {
        lastModule = c.module;
        html += `<div class="module-title">${esc(c.module)}</div>`;
      }
      html += `
        <div class="card course-item ${cs.completed ? "done" : ""} ${openCourses.has(c.id) ? "open" : ""}" data-course="${c.id}">
          <div class="course-head" data-action="toggle" data-id="${c.id}">
            <div class="num">${i}</div>
            <div class="t"><b>${esc(c.title)}${tag}${doneTag}${quizTag}</b><span>${esc(c.subtitle)}</span></div>
            <div class="arrow">▶</div>
          </div>
          <div class="course-body">
            ${c.content}
            ${renderCourseQuiz(c, cs)}
            <label class="field">我的笔记<span class="tip">（自动保存，随云端同步）</span></label>
            <textarea rows="3" data-action="notes" data-id="${c.id}" placeholder="写下你的理解、疑问或例子…">${esc(cs.notes || "")}</textarea>
            <div class="btn-row">
              <button class="btn ${cs.completed ? "ghost" : ""}" data-action="complete" data-id="${c.id}">${cs.completed ? "✓ 已学完（点击取消）" : "标记本课学完"}</button>
            </div>
          </div>
        </div>`;
    });
    $("#view-learn").innerHTML = html;
    wrapGlossary($("#view-learn"));
  }

  /* ------- 课末测验：确认真的学懂了 ------- */
  function renderCourseQuiz(c, cs) {
    if (!c.quiz) return "";
    cs.quiz = cs.quiz || {};
    const allRight = c.quiz.every((q, j) => cs.quiz[j] === q.answer);
    let html = `<div class="course-quiz" id="quiz-${c.id}">
      <h3>✍️ 学完测一测（确认你真的懂了）</h3>
      ${allRight ? '<div class="quiz-pass">🎉 测验通过！这个概念你已经掌握，复习卡片会帮你保持记忆。</div>' : '<p class="muted">选出你认为对的答案，答错会看到解析，改到全对为止。</p>'}`;
    c.quiz.forEach((q, j) => {
      const chosen = cs.quiz[j];
      html += `<div class="cq-q">${j + 1}. ${esc(q.q)}</div><div class="quiz-options">`;
      q.options.forEach((opt, oi) => {
        let cls = "quiz-opt";
        if (chosen !== undefined) {
          if (oi === q.answer) cls += " right";
          else if (oi === chosen) cls += " wrong";
        }
        html += `<button class="${cls}" data-action="quizAns" data-id="${c.id}" data-j="${j}" data-opt="${oi}">${esc(opt)}${chosen !== undefined && oi === q.answer ? " ✅" : ""}${chosen === oi && oi !== q.answer ? " ❌" : ""}</button>`;
      });
      html += `</div>`;
      if (chosen !== undefined) {
        const right = chosen === q.answer;
        html += `<div class="cq-explain ${right ? "ok" : "bad"}">${right ? "✅ 答对了！" : "❌ 再想想："}${esc(q.explain)}</div>`;
      }
    });
    html += `</div>`;
    return html;
  }
  function courseQuizPassed(c) {
    const cs = state.courses[c.id];
    return !!(c.quiz && cs && cs.quiz && c.quiz.every((q, j) => cs.quiz[j] === q.answer));
  }

  /* ---------------- 预习页 ---------------- */
  function renderPreview() {
    const next = nextCourse();
    let html = "";
    if (next) {
      const cs = courseState(next.id);
      const rec = state.assessment && state.assessment.recs[next.id];
      html += `
        <div class="card">
          <h2>🔭 下一课预习：${esc(next.title)} ${rec ? recLabel(rec) : ""}</h2>
          <p class="muted">${esc(next.subtitle)} · ${esc(next.module)}</p>
          <div class="why-box">💡 <b>为什么值得预习：</b>${esc(next.why)}</div>
          <ul class="preview-points">
            ${next.preview.map(p => `<li>${esc(p)}</li>`).join("")}
          </ul>
          <p class="muted">带着这些问题去读正文，比直接硬读效率高得多。</p>
          <div class="btn-row">
            <button class="btn ${cs.previewed ? "ghost" : ""}" data-action="previewed" data-id="${next.id}">${cs.previewed ? "✓ 已预习（点击取消）" : "标记本课已预习"}</button>
            <button class="btn ghost" data-action="gotoLearn" data-id="${next.id}">去学习本课 →</button>
          </div>
        </div>`;
    } else {
      html += `<div class="card empty"><span class="big">🎉</span>全部课程已学完！可以用「复习」巩固，或重新测评看看进步。</div>`;
    }
    html += `<div class="card"><h2>全部课程预习要点</h2>`;
    orderedCourses().forEach(c => {
      const i = COURSES.indexOf(c) + 1;
      const cs = courseState(c.id);
      const rec = state.assessment && state.assessment.recs[c.id];
      html += `
        <details ${c.id === (next && next.id) ? "open" : ""}>
          <summary style="cursor:pointer;padding:8px 0;font-weight:600;">第 ${i} 课 · ${esc(c.title)} ${rec ? recLabel(rec) : ""} ${cs.previewed ? '<span class="tag done">已预习</span>' : ""}</summary>
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
      const learned = CARDS.filter(c => state.cards[c.id]).length;
      const dueTomorrow = CARDS.filter(c => {
        const s = state.cards[c.id];
        return s && s.due > Date.now() && s.due < Date.now() + 24 * 3600 * 1000;
      }).length;
      const needQuiz = COURSES.filter(c => courseState(c.id).completed && !courseQuizPassed(c));
      $("#view-review").innerHTML = `
        <div class="card empty">
          <span class="big">🌿</span>
          <b>今天的复习任务全部完成！</b>
          <p class="muted">已学卡片 ${learned} / ${CARDS.length} · 24 小时内还有 ${dueTomorrow} 张到期。<br>复习讲求少而勤，明天再来效果最好。</p>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn ghost" data-action="forceReview">再练 5 张（加练）</button>
          </div>
        </div>
        ${needQuiz.length ? `
        <div class="card">
          <h2>📝 闯关测验：确认你真的学懂了</h2>
          <p class="muted">下面这些课你标记了学完，但课末测验还没全对。做对才算真正掌握：</p>
          ${needQuiz.map(c => `<div class="overview-row"><span>${esc(c.title)}</span><button class="btn sm" data-action="gotoQuiz" data-id="${c.id}">去测验 →</button></div>`).join("")}
        </div>` : ""}`;
      updateBadge();
      return;
    }
    currentCard = reviewQueue[0];
    const course = COURSES.find(c => c.id === currentCard.courseId);
    const s = state.cards[currentCard.id];
    const isNew = !s;
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
          <button class="btn warn" data-action="grade" data-q="4">🙂 想起来了<br><span style="font-size:.72rem;font-weight:400;">间隔会拉长</span></button>
          <button class="btn ok" data-action="grade" data-q="5">😄 很轻松<br><span style="font-size:.72rem;font-weight:400;">间隔更久</span></button>
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
    let assessHtml = "";
    if (state.assessment) {
      const s = state.assessment.scores;
      assessHtml = `<p class="muted">最近测评：${new Date(state.assessment.date).toLocaleDateString()} · ${levelName(s.total)}（${s.total}/${QUIZ.length}）</p>`;
    } else {
      assessHtml = `<p class="muted">还没有做过测评，去「学习」页开始 👉</p>`;
    }
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
        ${assessHtml}
      </div>
      <div class="card">
        <h2>跨设备同步（GitHub 云端）</h2>
        <p class="muted">在电脑和手机上都填入同一个 GitHub Token，即可把学习进度同步到你的 GitHub 私有 Gist。Token 只保存在本机浏览器里，不会同步给他人。</p>
        <label class="field">GitHub Token <span class="tip">建议用 fine-grained token，仅在 Account 权限里开 Gists 读写</span></label>
        <input type="password" id="tokenInput" value="${esc(token)}" placeholder="github_pat_…" />
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
          <li>📱 手机浏览器打开本页后，选择「添加到主屏幕」，即可像 App 一样全屏使用。</li>
          <li>🧠 复习卡片基于 SM-2 记忆算法自动排期：忘记的 10 分钟后重现，记住的间隔逐次拉长。</li>
          <li>✍️ 每课笔记自动保存在本地，并随同步上传。</li>
        </ul>
      </div>`;
  }

  /* ---------------- 侧栏概览 ---------------- */
  function renderOverview() {
    const due = dueCards().length;
    const next = nextCourse();
    const done = COURSES.filter(c => courseState(c.id).completed).length;
    const today = state.activity[todayStr()] || 0;
    const el = $("#overview");
    if (el) el.innerHTML = `
      <div class="overview-row"><span>📋 测评水平</span><b>${state.assessment ? levelName(state.assessment.scores.total) : "未测评"}</b></div>
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
      else if (res.status === 403) msg = "权限不足或触发限流（403），Gists 权限需在 Account 权限里开启";
      else if (res.status === 404) msg = "找不到该 Gist（404），请检查 Gist ID";
      throw new Error(msg);
    }
    return res.json();
  }
  function syncPayload() {
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
      if (cloud.version !== 2) cloud.version = 2;
      if (!cloud.assessment) cloud.assessment = null;
      const cT = cloud.updatedAt || 0, lT = state.updatedAt || 0;
      if (lT > cT) {
        if (!confirm(`本机进度（${new Date(lT).toLocaleString()}）比云端（${new Date(cT).toLocaleString()}）更新，仍要用云端覆盖本机吗？`)) return;
      }
      const token = localStorage.getItem(LS_TOKEN);
      state = cloud;
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
        if (!data || data.version !== 2) throw new Error("文件格式不对（需要 v2）");
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
    const termEl = ev.target.closest(".term");
    if (termEl) { showTerm(termEl.dataset.term); return; }
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === "startQuiz") {
      startQuiz();
    } else if (action === "quizPick") {
      quizAnswers[QUIZ[quizIdx].id] = parseInt(btn.dataset.opt, 10);
      quizIdx++;
      renderQuiz();
    } else if (action === "toggle") {
      const item = btn.closest(".course-item");
      item.classList.toggle("open");
      if (item.classList.contains("open")) openCourses.add(id); else openCourses.delete(id);
    } else if (action === "quizAns") {
      const cs = courseState(btn.dataset.id);
      cs.quiz = cs.quiz || {};
      cs.quiz[btn.dataset.j] = parseInt(btn.dataset.opt, 10);
      save();
      renderLearn();
    } else if (action === "closeCompanion") {
      const el = $("#companion");
      if (el) el.classList.add("hidden");
    } else if (action === "copyTpl") {
      const tpl = $("#companion .cp-tpl");
      const t = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(tpl.textContent) : Promise.reject();
      t.then(() => toast("提问模板已复制，去粘贴给任意 AI ✓")).catch(() => toast("请长按选中模板文字手动复制", 3500));
    } else if (action === "openGlossary") {
      openGlossary();
    } else if (action === "explainSel") {
      explainSelection();
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
    } else if (action === "grade") {
      if (!currentCard) return;
      grade(currentCard.id, parseInt(btn.dataset.q, 10));
      reviewQueue.shift();
      renderReview();
    } else if (action === "forceReview") {
      reviewQueue = newCards(5).concat(CARDS.filter(c => state.cards[c.id]).sort(() => Math.random() - 0.5).slice(0, 5));
      renderReview();
    } else if (action === "gotoQuiz") {
      openCourses.add(id);
      switchTab("learn");
      const q = document.getElementById("quiz-" + id);
      if (q) q.scrollIntoView({ behavior: "smooth", block: "start" });
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

  let lastSelText = "";
  function rangeText(r) {
    let t = "";
    try { t = r.toString(); } catch (e) { }
    if (!t) {
      const div = document.createElement("div");
      div.appendChild(r.cloneContents());
      t = div.textContent;
    }
    return t.trim();
  }
  document.addEventListener("pointerup", ev => {
    setTimeout(() => {
      const chip = $("#selChip");
      if (!chip) return;
      const sel = window.getSelection ? window.getSelection() : null;
      if (sel && sel.rangeCount && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const anchorEl = range.commonAncestorContainer.parentElement;
        const inCourse = anchorEl && anchorEl.closest && anchorEl.closest("#view-learn .course-body");
        const text = rangeText(range);
        if (inCourse && text.length > 3) {
          lastSelText = text;
          chip.classList.remove("hidden");
          return;
        }
      }
      chip.classList.add("hidden");
    }, 10);
  });

  /* ---------------- PWA ---------------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./sw.js").catch(() => { });
  }

  /* ---------------- 启动 ---------------- */
  renderOverview();
  switchTab("learn");
})();
