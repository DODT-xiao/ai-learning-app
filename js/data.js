/* 内置课程数据（v3：图解 + 课末测验 + 伴学术语库）
 * 课程体系参考：
 *   - microsoft/generative-ai-for-beginners（概念→提示词→应用→RAG→Agent→安全）
 *   - mlabonne/llm-course（基础部分可跳过、按需学习）
 *   - roadmap.sh/ai-engineer（面向用 AI 构建应用的人，而非造模型的研究员）
 */
const COURSES = [
  {
    id: "c1",
    module: "模块一 · 打好地基",
    title: "一个网页应用是怎么跑起来的",
    subtitle: "前端、后端、数据库、API、部署一次讲透",
    why: "你 vibe coding 时 AI 生成的几十个文件，到底各自是干嘛的？搞懂这一课，你才能看懂 AI 在搭什么。",
    preview: [
      "打开一个网页时，你看到的界面和服务器上跑的程序分别叫什么？",
      "你在页面点「提交」，数据最终被存到了哪里？",
      "前端和后端互相不认识，它们靠什么传话？",
      "一个应用开发完之后，怎么变成「网上能访问的网站」？"
    ],
    content: `
      <h3>一张图看懂：你去餐厅吃饭</h3>
      <p>把一个网页应用想象成一家餐厅：<b>前端</b>是餐厅大堂——菜单、装修、点餐屏，你直接看到和触摸的部分；<b>后端</b>是后厨——你看不见，但真正处理"红烧肉怎么做"的地方；<b>数据库</b>是仓库——所有食材（数据）整齐存放的地方；<b>API</b>是服务员——在大堂和后厨之间传菜传单。</p>
      <div class="dg"><svg viewBox="0 0 660 200" role="img" aria-label="前后端架构图">
      <defs><marker id="mA1" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#475569"/></marker></defs>
      <text x="330" y="22" text-anchor="middle" font-size="13" fill="#64748b">类比餐厅：前端=大堂 · API=服务员 · 后端=后厨 · 数据库=仓库</text>
      <rect x="10" y="60" width="150" height="84" rx="12" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
      <text x="85" y="88" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">🖥️ 前端</text>
      <text x="85" y="108" text-anchor="middle" font-size="12" fill="#475569">HTML / CSS / JS</text>
      <text x="85" y="126" text-anchor="middle" font-size="12" fill="#475569">用户看到的界面</text>
      <line x1="164" y1="112" x2="254" y2="112" stroke="#475569" stroke-width="2" marker-end="url(#mA1)"/>
      <line x1="254" y1="92" x2="164" y2="92" stroke="#475569" stroke-width="2" marker-end="url(#mA1)"/>
      <text x="209" y="72" text-anchor="middle" font-size="12" fill="#0ea5e9" font-weight="bold">API 传话</text>
      <text x="209" y="140" text-anchor="middle" font-size="11" fill="#64748b">请求 / 响应</text>
      <rect x="258" y="60" width="150" height="84" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="333" y="88" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">🍳 后端</text>
      <text x="333" y="108" text-anchor="middle" font-size="12" fill="#475569">服务器上的程序</text>
      <text x="333" y="126" text-anchor="middle" font-size="12" fill="#475569">处理业务逻辑</text>
      <line x1="412" y1="112" x2="490" y2="112" stroke="#475569" stroke-width="2" marker-end="url(#mA1)"/>
      <line x1="490" y1="92" x2="412" y2="92" stroke="#475569" stroke-width="2" marker-end="url(#mA1)"/>
      <text x="451" y="72" text-anchor="middle" font-size="12" fill="#0ea5e9" font-weight="bold">读写数据</text>
      <rect x="494" y="60" width="156" height="84" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="572" y="88" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">🗄️ 数据库</text>
      <text x="572" y="108" text-anchor="middle" font-size="12" fill="#475569">数据安全存放</text>
      <text x="572" y="126" text-anchor="middle" font-size="12" fill="#475569">不因刷新丢失</text>
      <text x="330" y="180" text-anchor="middle" font-size="12" fill="#94a3b8">代码写好后「部署」到云服务器，全世界就能访问了</text>
      </svg></div>
      <h3>前端（Frontend）：你看到的一切</h3>
      <p>浏览器里显示的页面、按钮、动画，由三种代码写成：<b>HTML</b> 是骨架（页面上有什么）、<b>CSS</b> 是皮肤（长什么样、什么颜色）、<b>JavaScript</b> 是动作（点击后发生什么）。你现在用的这个学习应用，界面就是前端。你 vibe coding 时 AI 生成的 <code class="inline">index.html</code>、<code class="inline">style.css</code>，就是前端文件。</p>
      <h3>后端（Backend）：看不见的干活的人</h3>
      <p>登录校验密码、下单扣库存、给推荐内容——这些不能放在你的浏览器里做（否则谁都能篡改），必须在服务器上跑。后端程序可以用 Python、Node.js、Java 等语言写，运行在一台 24 小时开机、机房托管的<b>服务器</b>上。</p>
      <h3>数据库（Database）：数据的家</h3>
      <p>你的注册信息、订单、笔记，最终都写进数据库——一个专门用来安全存取数据的软件（如 MySQL、PostgreSQL）。它不会因为刷新页面而丢失，还能高效地"查一下张三的所有订单"。</p>
      <h3>API：前后端的传话人</h3>
      <p>前端和后端是两个独立程序，靠 <b>API</b>（应用程序接口）沟通。你点"提交订单"，前端向后端的 API 发一个请求（"帮我下一单，内容是这些"），后端处理完返回结果（"下单成功，订单号 888"）。下一讲我们会发现：<b>调用 ChatGPT，本质上也是调 API</b>。</p>
      <h3>部署（Deploy）：让全世界访问</h3>
      <p>代码写完只是开始，还要放到服务器上跑起来，这一步叫<b>部署</b>。你现在用的这个学习网站就部署在 GitHub Pages 上（免费的静态网站托管）。复杂应用则部署到阿里云、腾讯云、AWS 等云平台。</p>
      <h3>回到 vibe coding</h3>
      <p>下次 AI 给你生成一堆文件时，你可以这样对号入座：<code class="inline">.html/.css/.js</code> 是前端、<code class="inline">server.py / app.js</code>（跑在服务器上的）是后端、<code class="inline">schema.sql / database</code> 相关是数据库、<code class="inline">deploy</code> 相关是部署。虽然不用手写，但知道谁是谁，你才能判断 AI 是不是搭对了。</p>`,
    cards: [
      { q: "前端、后端、数据库分别对应餐厅里的什么？", a: "前端=大堂（看得见的界面），后端=后厨（看不见的处理逻辑），数据库=仓库（数据存放），API=服务员（前后端之间传话）。" },
      { q: "HTML、CSS、JavaScript 各负责什么？", a: "HTML 是骨架（页面内容结构），CSS 是皮肤（外观样式），JavaScript 是动作（交互逻辑）。" },
      { q: "为什么登录校验要放在后端做，不能只在前端？", a: "前端代码运行在用户浏览器里，用户可以随意查看和篡改；安全逻辑必须放在自己控制的服务器（后端）上。" },
      { q: "API 是什么？用一个比喻说明", a: "应用程序接口，相当于餐厅服务员：前端向后端发请求（点菜），后端处理后返回结果（上菜）。调用 ChatGPT 也是调 API。" },
      { q: "「部署」是什么意思？", a: "把写好的代码放到服务器上运行，让全世界都能通过网址访问。静态网站可用 GitHub Pages，复杂应用用云服务器。" },
      { q: "AI 给你生成了 index.html、server.py、schema.sql，各是什么？", a: "index.html 是前端页面；server.py 是后端程序；schema.sql 是数据库表结构定义。" }
    ],
    quiz: [
      { q: "用户在浏览器里填写的登录密码，应该在哪个环节校验？", options: ["后端服务器", "浏览器前端", "数据库"], answer: 0, explain: "前端代码用户能看到、能篡改，安全校验必须放在自己控制的后端。" },
      { q: "AI 帮你生成了一个 style.css 文件，它属于哪一层？", options: ["前端", "后端", "数据库"], answer: 0, explain: ".css 是样式文件，属于前端三件套（HTML/CSS/JS）。" },
      { q: "「部署」指的是什么？", options: ["把代码压缩变小", "把代码放到服务器上运行，让用户能访问", "给代码加密"], answer: 1, explain: "部署 = 上线。代码要在服务器上跑起来，别人才能通过网址访问。" }
    ]
  },
  {
    id: "c2",
    module: "模块一 · 打好地基",
    title: "大模型是怎么工作的",
    subtitle: "读懂 ChatGPT 的原理，才能预判它的表现",
    why: "知道大模型「在做什么」，你就能理解它为什么有时聪明有时犯傻，用起来心里有底。",
    preview: [
      "大模型生成文字时，每一步本质上在计算什么？",
      "为什么大模型会「一本正经地胡说八道」？",
      "「上下文窗口」限制了大模型的什么能力？",
      "训练和推理有什么区别？哪个烧钱？"
    ],
    content: `
      <h3>核心：文字接龙机器</h3>
      <p>大模型（如 GPT）做的事业朴素得出奇：<b>根据前面所有文字，预测下一个词的概率</b>。看下图："今天天气真" 后面，接"好"的概率是 85%……选中一个词，拼回去，再预测下一个，如此循环。</p>
      <div class="dg"><svg viewBox="0 0 660 200" role="img" aria-label="文字接龙示意图">
      <defs><marker id="mA2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#475569"/></marker></defs>
      <rect x="10" y="80" width="160" height="60" rx="12" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
      <text x="90" y="105" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">已生成的文字</text>
      <text x="90" y="124" text-anchor="middle" font-size="13" fill="#475569">「今天天气真___」</text>
      <line x1="174" y1="110" x2="240" y2="110" stroke="#475569" stroke-width="2" marker-end="url(#mA2)"/>
      <rect x="244" y="70" width="150" height="80" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="319" y="102" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">🤖 大模型</text>
      <text x="319" y="124" text-anchor="middle" font-size="12" fill="#475569">计算下一个词</text>
      <text x="319" y="140" text-anchor="middle" font-size="12" fill="#475569">的概率分布</text>
      <line x1="398" y1="110" x2="452" y2="110" stroke="#475569" stroke-width="2" marker-end="url(#mA2)"/>
      <text x="492" y="66" text-anchor="middle" font-size="12" fill="#1e293b" font-weight="bold">好 · 85%</text>
      <rect x="460" y="72" width="180" height="12" rx="6" fill="#e2e8f0"/><rect x="460" y="72" width="153" height="12" rx="6" fill="#4f46e5"/>
      <text x="492" y="106" text-anchor="middle" font-size="12" fill="#1e293b">不错 · 10%</text>
      <rect x="460" y="96" width="180" height="12" rx="6" fill="#e2e8f0"/><rect x="460" y="96" width="18" height="12" rx="6" fill="#0ea5e9"/>
      <text x="492" y="136" text-anchor="middle" font-size="12" fill="#1e293b">冷 · 5%</text>
      <rect x="460" y="120" width="180" height="12" rx="6" fill="#e2e8f0"/><rect x="460" y="120" width="9" height="12" rx="6" fill="#94a3b8"/>
      <path d="M 540 150 C 400 205 150 195 88 148" stroke="#0ea5e9" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#mA2)"/>
      <text x="320" y="196" text-anchor="middle" font-size="12" fill="#0ea5e9">选中一个词拼回去 → 再预测下一个 → 循环，直到整段话写完</text>
      </svg></div>
      <p>所有翻译、写代码、写报告，本质上都是这场高级接龙——因为要接得像样，模型必须"理解"语言和知识。</p>
      <h3>Token：模型眼里的文字单位</h3>
      <p>模型不按"字"或"词"读文本，而是按 <b>token</b>（词元）——一个英文单词可能是 1 个 token，一个汉字通常是 1-2 个 token。计费、速度限制、上下文长度，全都按 token 数计算，这就是为什么 API 按 token 收费。</p>
      <h3>训练 vs 推理</h3>
      <ul>
        <li><b>训练</b>：让模型读完海量文本（几乎是整个互联网），用几万张显卡跑几个月，调整数千亿个<b>参数</b>。极贵，只有大公司做。</li>
        <li><b>推理</b>：训练好的模型被你使用的过程（你问它答）。你每次对话，模型都在做几亿次计算，所以按 token 收费。</li>
      </ul>
      <h3>上下文窗口：模型的"工作记忆"</h3>
      <p>模型一次能处理的文本长度有限，这个上限叫<b>上下文窗口</b>（如 128K token ≈ 一本长篇小说）。超出窗口的早期对话，模型就"忘了"——这就是为什么聊太久它会把开头的事忘掉，也是为什么长文档要"切块"处理（后面 RAG 一讲细说）。</p>
      <h3>幻觉：为什么它会编造</h3>
      <p>模型的目标是"接得像"，不是"说得对"。当它没学过某个事实时，仍会按概率编一个<b>听起来最合理</b>的答案——这就是<b>幻觉（Hallucination）</b>。对策：要求它只基于你给的资料回答（RAG）、要求给出来源、关键信息人工核实。</p>
      <h3>温度（Temperature）：创造力的旋钮</h3>
      <p>调用模型 API 时有个参数 temperature：调低 → 每次都选概率最高的词，回答稳定刻板（适合提取数据）；调高 → 敢选小概率的词，回答更有创意但更不稳（适合头脑风暴）。理解这个，你就明白为什么同一种提示词有时效果好有时差。</p>`,
    cards: [
      { q: "大模型生成文字的本质是什么？", a: "根据前面所有文字预测下一个词的概率（文字接龙），循环生成。写代码、翻译都是这场接龙。" },
      { q: "Token 是什么？为什么重要？", a: "模型处理文本的最小单位（约半个到一个词/汉字）。API 计费、上下文长度、速度限制都按 token 计算。" },
      { q: "训练和推理的区别？", a: "训练=读海量文本调参数，极贵，大公司才做；推理=训练好的模型被使用（你问它答），按 token 收费。" },
      { q: "为什么聊得久了大模型会忘记开头说的话？", a: "上下文窗口有限（如 128K token），超出窗口的早期内容不再参与计算，等于被遗忘了。" },
      { q: "幻觉产生的原因是什么？", a: "模型优化的是「接得像」而非「说得对」，没学过的事实也会按概率编出听起来合理的答案。" },
      { q: "temperature 参数调低/调高分别什么效果？", a: "调低：总选最高概率词，稳定刻板，适合数据提取；调高：敢选小概率词，有创意但不稳定，适合头脑风暴。" }
    ],
    quiz: [
      { q: "大模型逐字生成文本时，每一步在做什么？", options: ["在数据库里搜索现成答案", "预测下一个词的概率", "播放预先写好的模板"], answer: 1, explain: "本质是文字接龙：根据前文计算每个候选词的概率，选一个拼回去继续。" },
      { q: "和 AI 聊了很久后它「忘了」开头，是因为？", options: ["上下文窗口有限，超出的内容不再参与计算", "它故意装忘", "网络不稳定"], answer: 0, explain: "上下文窗口是工作记忆上限，早期对话被挤出窗口就等于遗忘。" },
      { q: "把 temperature 调低，模型会怎样？", options: ["更有创意", "回答更稳定、刻板", "响应更快"], answer: 1, explain: "调低=总选最高概率词，输出稳定但呆板，适合数据提取类任务。" }
    ]
  },
  {
    id: "c3",
    module: "模块二 · 把 AI 用明白",
    title: "提示词工程实战",
    subtitle: "同样的模型，问法决定效果",
    why: "提示词是职场人回报率最高的 AI 技能：不用写一行代码，立刻见效。",
    preview: [
      "「你是一位资深编辑」这句话为什么能改善输出？",
      "什么是 few-shot（少样本示例）？",
      "为什么「先分析再给结论」能让回答更准？",
      "好的提示词通常包含哪几个部分？"
    ],
    content: `
      <h3>一个万能提示词框架</h3>
      <p>记住五个字：<b>角、背、任、格、例</b>。</p>
      <ul>
        <li><b>角</b>（角色）：「你是一位有 10 年经验的财务分析师」——让模型进入对应的语言风格和知识密度。</li>
        <li><b>背</b>（背景）：把相关材料直接贴进去。模型不知道你公司的情况，资料给得越具体，输出越可用。</li>
        <li><b>任</b>（任务）：明确动词和标准。「总结成 5 条要点，每条不超过 30 字」远好于「帮我总结一下」。</li>
        <li><b>格</b>（格式）：指定输出结构，如「用 Markdown 表格」「先结论后论据」。方便你直接粘贴使用。</li>
        <li><b>例</b>（示例）：给 1-2 个你满意的样子（few-shot），模型会模仿。这是提升格式和口吻命中率最强的技巧。</li>
      </ul>
      <h3>进阶三招</h3>
      <ul>
        <li><b>分步思考</b>：「请先列出分析步骤，再给出结论」——让模型"想"的过程显式化，复杂问题准确率明显提升。</li>
        <li><b>迭代而非重来</b>：第一次输出不满意，不要换全新提示词，而是追加指令：「第 2 点太笼统，展开说」「语气再正式一点」。对话式打磨比推倒重来高效。</li>
        <li><b>让 AI 反问你</b>：「在开始之前，先问我 3 个你需要知道的问题」——弥补你没写清的背景，特别适合写作类任务。</li>
      </ul>
      <h3>职场实战示例</h3>
      <p>❌ 差：「帮我写个周报。」<br>
      ✅ 好：「你是一位互联网项目经理（角）。本周进展如下：①上线了XX功能 ②修复了3个线上问题（背）。请写一份给部门总监的周报（任），要求：先一句话总结，再分「进展/风险/下周计划」三段，每段不超过3条（格）。这是上周的周报风格，请保持一致：[粘贴上周周报]（例）」</p>
      <h3>避坑清单</h3>
      <ul>
        <li>一次别塞太多任务——拆成多轮对话效果更好。</li>
        <li>重要事实（数据、法条、人名）要求模型「引用原文」或自己核实，防幻觉。</li>
        <li>提示词是可以复用的资产：好用的存成模板，这就是你的"提示词库"。</li>
      </ul>`,
    cards: [
      { q: "万能提示词框架「角背任格例」是什么？", a: "角色设定、背景材料、明确任务动词和标准、指定输出格式、给出少样本示例（few-shot）。" },
      { q: "few-shot 是什么？为什么有效？", a: "在提示词里给 1-2 个期望输出的示例，模型会模仿其格式、口吻和风格，命中率远高于纯文字描述。" },
      { q: "输出不满意时，更高效的做法是什么？", a: "迭代追问而非重来：针对具体问题追加指令（如「第2点展开」「语气更正式」），在原对话里打磨。" },
      { q: "「先分析再给结论」为什么能提升准确率？", a: "让模型把推理过程显式写出来（分步思考），相当于给它更多计算步骤，复杂问题的错误率明显下降。" },
      { q: "列出两条提示词避坑原则", a: "①一次别塞太多任务，拆成多轮；②重要事实要求引用原文或人工核实；③好提示词存成模板复用。（答两条即可）" }
    ],
    quiz: [
      { q: "「你是一位资深财务分析师」属于提示词框架里的哪个要素？", options: ["角色", "任务", "格式"], answer: 0, explain: "角色设定让模型切换到对应的语言风格和知识密度。" },
      { q: "给 AI 一个你满意的成品让它模仿，这叫？", options: ["few-shot 少样本示例", "分步思考", "重新训练"], answer: 0, explain: "示例（few-shot）是提升格式和口吻命中率最强的技巧。" },
      { q: "第一次输出不理想，更推荐的做法是？", options: ["换个全新的提示词重问", "在原对话里针对具体问题迭代追问", "放弃这个任务"], answer: 1, explain: "迭代打磨比推倒重来高效：指出哪里不满意，让模型修改。" }
    ]
  },
  {
    id: "c4",
    module: "模块二 · 把 AI 用明白",
    title: "Vibe Coding 的正确姿势",
    subtitle: "会指挥 AI 写代码，更要会验收",
    why: "你已经会用 AI 写代码，这一课帮你从「能跑起来」升级到「敢上线、能排查」。",
    preview: [
      "AI 为什么会写代码？它写代码和你学写代码的过程一样吗？",
      "AI 生成的代码最常见的三种问题是什么？",
      "「小步提交」是什么意思？为什么能救命？",
      "需求描述里少了什么，AI 一定会写偏？"
    ],
    content: `
      <h3>先理解：AI 写代码 = 超级模仿</h3>
      <p>AI 在海量开源代码上训练过，所以它写代码是<b> pattern 拼装</b>：见过一万个类似需求，就拼一个统计上最像的方案。这带来两个结论：①常见需求（登录、表单、列表页）它写得又快又好；②<b>它不知道你的项目里已经写了什么</b>（除非你告诉它），所以经常生成重复、冲突或风格不一致的代码。</p>
      <h3>AI 代码的三种典型问题</h3>
      <ul>
        <li><b>编造</b>：调用不存在的函数、库或参数，还一本正经（幻觉在代码里的样子）。表现为一运行就报错 <code class="inline">undefined is not a function</code>。</li>
        <li><b>过时</b>：训练数据有截止日期，可能给你已经被淘汰的写法或旧版本 API。</li>
        <li><b>隐雷</b>：功能看似正常，但有安全漏洞（如密码明文存储）、性能陷阱（如循环里查数据库）。这个最危险，因为不报错。</li>
      </ul>
      <h3>正确的协作姿势</h3>
      <ul>
        <li><b>小步快跑</b>：别一次让 AI 生成 500 行。先要方案 → 确认 → 再要第一小块实现 → 跑通 → 下一步。每一步你都能看懂再继续。</li>
        <li><b>给足上下文</b>：把报错信息完整贴回去、说明"我这个项目用了什么框架、什么版本"，AI 修正精度立刻上升。</li>
        <li><b>让它解释</b>：「逐行解释这段代码在干嘛，有没有安全或性能隐患」——这是你边做边学、防止隐雷的最好办法。</li>
        <li><b>版本管理</b>：学会两个 git 命令就能救命——每完成一小步就 <code class="inline">git add . && git commit -m "描述"</code> 存档；写坏了 <code class="inline">git checkout .</code> 回滚到上个存档。AI 写崩了随时能回去。</li>
      </ul>
      <h3>验收清单（上线前过一遍）</h3>
      <ul>
        <li>核心功能自己点一遍：正常流程 + 输错数据 + 疯狂连点。</li>
        <li>密码、API Key 有没有明文写在代码里？（应该用环境变量）</li>
        <li>问 AI：「这段代码有什么安全风险？」让它自己审一遍。</li>
        <li>数据存在哪？删了页面数据还在吗？（需要数据库的应用，AI 默认可能只存在内存里，重启就丢）</li>
      </ul>`,
    cards: [
      { q: "AI 写代码的本质是什么？带来哪两个结论？", a: "对海量开源代码的统计模仿（pattern 拼装）。结论：①常见需求写得快好；②不了解你的项目上下文，易生成重复/冲突代码。" },
      { q: "AI 生成代码的三种典型问题？", a: "编造（调用不存在的函数，一跑就报错）、过时（用旧版本写法）、隐雷（功能正常但有安全/性能问题，最危险）。" },
      { q: "为什么建议「小步快跑」而不是一次生成几百行？", a: "小块生成每步都能跑通、看得懂，出问题容易定位回退；大块生成一旦出错，排查成本指数级上升。" },
      { q: "git 的存档和回滚各用什么命令？", a: "存档：git add . + git commit -m \"描述\"；回滚到最近存档：git checkout .（丢弃未提交修改）。" },
      { q: "上线前的验收清单至少列三条", a: "①自己过一遍正常+异常流程；②检查密钥是否明文（应用环境变量）；③让 AI 自审安全风险；④确认数据存储持久化（是否重启就丢）。" },
      { q: "遇到报错，喂给 AI 的正确方式？", a: "完整贴报错信息（含堆栈），说明项目的框架和版本等上下文，而不是只说「跑不起来」。" }
    ],
    quiz: [
      { q: "AI 写代码的本质是？", options: ["理解你的业务后从零设计", "对海量开源代码的统计模仿", "随机组合字符"], answer: 1, explain: "它见过一万个类似需求，拼一个统计上最像的方案——所以常见需求强，上下文弱。" },
      { q: "AI 代码的三种问题里，最危险的是？", options: ["一跑就报错的编造", "用了过时写法", "功能正常但有安全漏洞的隐雷"], answer: 2, explain: "隐雷不报错、不易发现，如密码明文存储、数据只存内存重启就丢。" },
      { q: "git commit 的作用是？", options: ["发布上线", "存档当前进度，可随时回滚", "删除历史代码"], answer: 1, explain: "commit 是存档点：AI 写崩了随时 checkout 回到上一个能用的版本。" }
    ]
  },
  {
    id: "c5",
    module: "模块二 · 把 AI 用明白",
    title: "AI 办公自动化",
    subtitle: "把重复劳动变成一条提示词",
    why: "这是 AI 对职场人最直接的回报：每天省下 1-2 小时。",
    preview: [
      "你每天的工作里，哪些是「重复+有模板」型的？",
      "处理 Excel 数据，AI 能做到什么程度？",
      "会议录音转的纪要，怎么让 AI 提炼成行动项？",
      "哪些环节必须留给自己把关？"
    ],
    content: `
      <h3>先给工作分类：AI 接手矩阵</h3>
      <ul>
        <li><b>AI 全自动</b>：格式转换、错别字检查、翻译、固定格式周报骨架——准确率高、错了也容易发现。</li>
        <li><b>AI 起草+人审</b>：邮件、方案初稿、会议纪要、数据摘要——AI 出 80 分初稿，你改到 95 分。</li>
        <li><b>人主导+AI 辅助</b>：重要决策、绩效评价、对外承诺——AI 只提供分析视角，责任在你。</li>
      </ul>
      <h3>四大高频场景</h3>
      <ul>
        <li><b>写作类</b>：周报、邮件、方案。技巧是把上一次满意的成品作为示例贴进去（few-shot），口吻格式立刻对齐。</li>
        <li><b>数据类</b>：把表格贴给 AI：「分析这份销售数据，找出 3 个异常和 2 个趋势，用表格输出」。注意：敏感数字要脱敏；大型表格用 ChatGPT 的数据分析功能（上传文件）或 Excel 的 Copilot。</li>
        <li><b>会议类</b>：录音转文字（飞书/钉钉/讯飞都自带）→ 贴给 AI：「提炼为：结论 / 待办事项（负责人+截止时间）/ 存在分歧」，比通读全文快 10 倍。</li>
        <li><b>知识类</b>：长文档速读：「用 10 条要点总结这份 50 页报告，标注每条出自第几章」——要求标注出处能压住幻觉。</li>
      </ul>
      <h3>升级：从"问一次"到"搭工作流"</h3>
      <p>重复出现的任务值得升级为<b>自动化工作流</b>：比如每周一自动汇总上周表格并生成周报。工具路线有两条：①零代码——影刀、n8n、企业微信/飞书机器人；②vibe coding——让 AI 帮你写一个定时跑的小脚本。判断标准：这个任务每周出现 ≥2 次、规则清晰，就值得搭。</p>
      <h3>守住的底线</h3>
      <p>凡是<b>对外发出的</b>（给客户的邮件、给老板的数字）必须人工核验；凡是<b>敏感数据</b>（客户信息、财务明细）先脱敏再喂 AI。AI 是实习生，签字权永远在你手里。</p>`,
    cards: [
      { q: "AI 接手矩阵把工作分成哪三类？", a: "AI 全自动（格式转换等）；AI 起草+人审（邮件、纪要初稿）；人主导+AI 辅助（重要决策）。风险越高越靠人。" },
      { q: "会议录音处理的高效流程？", a: "录音转文字 → AI 提炼为「结论 / 待办（负责人+截止时间）/ 分歧」三段式，替代通读全文。" },
      { q: "让 AI 总结长文档时，如何压住幻觉？", a: "要求分条总结并标注出处（第几章/页），必要时让它先引用原文再总结；关键结论人工抽查。" },
      { q: "什么任务值得升级成自动化工作流？", a: "每周出现 ≥2 次、规则清晰明确的重复任务。工具可选零代码（影刀/n8n/机器人）或 vibe coding 写脚本。" },
      { q: "职场用 AI 的两条底线？", a: "对外发出的内容（客户邮件、上报数字）必须人工核验；敏感数据先脱敏再喂给公开 AI。" }
    ],
    quiz: [
      { q: "哪类工作适合「AI 全自动、不需要人审」？", options: ["给客户的报价单", "格式转换、翻译、错别字检查", "绩效评价"], answer: 1, explain: "机械转换类错误易发现、风险低；对外内容和高风险判断必须人把关。" },
      { q: "处理会议录音的高效流程是？", options: ["自己通读全文整理", "先转文字，再让 AI 提炼为结论/待办/分歧三段", "只记一下标题"], answer: 1, explain: "转文字后让 AI 按固定结构提炼，比通读快 10 倍。" },
      { q: "什么任务值得搭自动化工作流？", options: ["一年才做一次的", "每周出现 ≥2 次且规则清晰的", "规则每次都变的"], answer: 1, explain: "高频+规则清晰才值得投入搭建成本；规则常变的任务自动化维护成本高。" }
    ]
  },
  {
    id: "c6",
    module: "模块三 · 懂原理会搭建",
    title: "API：应用之间的外卖窗口",
    subtitle: "看懂 AI 应用的血管系统",
    why: "AI 应用 = 你自己的界面 + 大模型 API。看懂这一课，你就看懂了 80% 的 AI 应用是怎么搭的。",
    preview: [
      "外卖平台的「取餐口」和 API 有什么相似之处？",
      "API Key 相当于什么？泄露了会怎样？",
      "调用一次大模型，请求里包含什么、返回里有什么？",
      "为什么说「这个应用是套壳 GPT」？套壳丢人吗？"
    ],
    content: `
      <h3>API 就是标准化的外卖窗口</h3>
      <p>第一课我们说 API 是前后端的传话人。放大到整个互联网：<b>API 是程序之间约定的对话方式</b>——你按规定的格式发请求，我按规定格式回你数据，双方不用知道对方内部怎么实现。就像外卖平台的取餐口：不管后厨是哪家店，你都能用同一种方式取餐。</p>
      <h3>一次大模型 API 调用的全过程</h3>
      <div class="dg"><svg viewBox="0 0 660 200" role="img" aria-label="API 调用流程图">
      <defs><marker id="mA3" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#475569"/></marker></defs>
      <rect x="10" y="70" width="160" height="76" rx="12" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
      <text x="90" y="100" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">📱 你的应用</text>
      <text x="90" y="122" text-anchor="middle" font-size="12" fill="#475569">界面 + 你的代码</text>
      <line x1="174" y1="94" x2="260" y2="94" stroke="#475569" stroke-width="2" marker-end="url(#mA3)"/>
      <text x="217" y="80" text-anchor="middle" font-size="11" fill="#64748b">① 请求</text>
      <line x1="260" y1="126" x2="174" y2="126" stroke="#475569" stroke-width="2" marker-end="url(#mA3)"/>
      <text x="217" y="168" text-anchor="middle" font-size="11" fill="#64748b">② 响应</text>
      <rect x="264" y="60" width="170" height="96" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="349" y="90" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">🧠 大模型 API</text>
      <text x="349" y="112" text-anchor="middle" font-size="12" fill="#475569">云上的"大脑"</text>
      <text x="349" y="130" text-anchor="middle" font-size="12" fill="#475569">按 token 计费</text>
      <rect x="478" y="60" width="172" height="96" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="564" y="88" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">🔑 API Key</text>
      <text x="564" y="108" text-anchor="middle" font-size="11.5" fill="#475569">= 身份证 + 钱包</text>
      <text x="564" y="126" text-anchor="middle" font-size="11.5" fill="#475569">只放后端服务器</text>
      <text x="564" y="144" text-anchor="middle" font-size="11.5" fill="#dc2626">绝不放前端代码里！</text>
      <text x="330" y="30" text-anchor="middle" font-size="13" fill="#64748b">请求里带：模型名 + 你的问题 + API Key　→　响应里返回：生成的文字</text>
      <text x="330" y="188" text-anchor="middle" font-size="12" fill="#94a3b8">所谓「AI 应用」，本质就是：把输入装进请求，把返回的文字放进漂亮界面</text>
      </svg></div>
      <p>你在很多 AI 应用里打字提问，背后发生的事其实只有一次 HTTP 请求：</p>
      <pre>POST https://api.openai.com/v1/chat/completions
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "帮我总结这份报告：……"}
  ],
  "temperature": 0.7
}</pre>
      <p>返回：<code class="inline">{"choices":[{"message":{"content":"好的，总结如下……"}}]}</code>。<b>所有"AI 应用"，本质都是把你的输入装进这样的请求、把返回的文本放到漂亮的界面里</b>。所谓「套壳」，指的就是自己不训练模型、调用大厂 API 做应用——这完全不丢人，市面上大多数成功 AI 产品都是"套壳+独特体验"，就像餐厅不必自己种菜。</p>
      <h3>API Key：你的身份证+钱包</h3>
      <p>调用 API 要带 <b>API Key</b>（一串密钥），作用有二：①证明"你是谁"（权限）；②记录"用了多少"（按 token 计费，从你的账户扣钱）。<b>关键安全规则</b>：Key 绝不能写在前端代码里——前端代码用户都能看到，等于把银行卡密码贴在大堂。Key 只放后端服务器（环境变量里），前端通过你自己的后端转手调用。</p>
      <h3>三个工程常识</h3>
      <ul>
        <li><b>计费</b>：输入和输出分别计价，长对话越聊越贵（历史消息每次都要重发一遍）。</li>
        <li><b>限流</b>：API 有每分钟调用次数限制，超了会报 429 错误，程序要会"等一下再试"。</li>
        <li><b>超时与重试</b>：网络会失败，成熟应用都会自动重试——你 vibe coding 时可以明确要求 AI 加上这些处理。</li>
      </ul>`,
    cards: [
      { q: "API 的作用是什么？", a: "程序之间约定的对话方式：按规定格式发请求、按规定格式收数据，双方无需了解对方内部实现。" },
      { q: "「套壳 GPT」是什么意思？丢人吗？", a: "自己不训练模型，调用大模型 API 加上自己的界面和体验做产品。不丢人，多数成功 AI 产品都是这样，如同餐厅不必自己种菜。" },
      { q: "API Key 为什么不能写在前端代码里？", a: "前端代码对所有用户可见，Key 会泄露被盗刷。必须放在后端服务器（环境变量），由后端转发调用大模型。" },
      { q: "为什么多轮对话越聊成本越高？", a: "模型没有记忆，每轮都要把全部历史消息重新发送给 API，输入 token 随对话变长而累积增加。" },
      { q: "HTTP 429 错误表示什么？怎么处理？", a: "触发限流（每分钟调用超限）。处理：等待后自动重试（退避重试），或申请提升配额。" }
    ],
    quiz: [
      { q: "API Key 的作用是什么？", options: ["给聊天内容加密", "证明你是谁，并按用量计费", "提升模型智力"], answer: 1, explain: "Key = 身份证 + 钱包：验证权限、记录用量扣费。所以泄露等于钱包泄露。" },
      { q: "API Key 应该放在哪里？", options: ["前端代码里", "后端服务器的环境变量里", "发到工作群里保管"], answer: 1, explain: "前端代码人人可见；Key 只能放后端（环境变量），由后端转发调用。" },
      { q: "调用 API 收到 429 错误，正确处理是？", options: ["立刻疯狂重试", "等待一会儿再重试（退避重试）", "重启电脑"], answer: 1, explain: "429=触发限流。疯狂重试只会更糟，正确做法是等一会儿再试。" }
    ]
  },
  {
    id: "c7",
    module: "模块三 · 懂原理会搭建",
    title: "RAG：让 AI 懂你的资料",
    subtitle: "企业知识库背后的核心技术",
    why: "想让 AI 回答你公司文档里的问题？RAG 是最实用的答案，也是 AI 应用创业最常做的方向。",
    preview: [
      "直接把 1000 份文档全贴给大模型可行吗？为什么？",
      "「向量」怎么把一句话变成一串数字？",
      "RAG 的四个步骤是什么？",
      "什么时候该用 RAG，什么时候该微调模型？"
    ],
    content: `
      <h3>为什么需要 RAG</h3>
      <p>大模型只知道自己训练时读过的东西，你公司的产品手册、内部制度它一无所知；硬要它答，就会幻觉。解决思路一：微调模型（把知识"练进"参数里）——贵、慢、更新难。思路二：<b>RAG（检索增强生成）</b>——先找到相关资料，塞进提示词里让它"开卷考试"。便宜、即时可更新，是绝对主流。</p>
      <h3>关键难题：资料太多，窗口太小</h3>
      <p>上下文窗口装不下 1000 份文档。怎么从海量资料里<b>找出最相关的几段</b>？早期用关键词搜索（搜"请假"找含"请假"二字），但"年假怎么申请"就搜不到写着"休假流程"的段落。<b>向量检索</b>解决了这个问题。</p>
      <h3>RAG 完整流水线</h3>
      <div class="dg"><svg viewBox="0 0 660 210" role="img" aria-label="RAG 流程图">
      <defs><marker id="mA4" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#475569"/></marker></defs>
      <text x="10" y="24" font-size="13" font-weight="bold" fill="#4f46e5">提前准备（知识入库）</text>
      <rect x="10" y="36" width="140" height="44" rx="10" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/><text x="80" y="63" text-anchor="middle" font-size="12.5" fill="#1e293b">📄 你的文档</text>
      <line x1="154" y1="58" x2="176" y2="58" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="180" y="36" width="140" height="44" rx="10" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/><text x="250" y="63" text-anchor="middle" font-size="12.5" fill="#1e293b">✂️ 切成小段</text>
      <line x1="324" y1="58" x2="346" y2="58" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="350" y="36" width="140" height="44" rx="10" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/><text x="420" y="63" text-anchor="middle" font-size="12.5" fill="#1e293b">🔢 转成向量</text>
      <line x1="494" y1="58" x2="516" y2="58" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="520" y="36" width="130" height="44" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/><text x="585" y="63" text-anchor="middle" font-size="12.5" fill="#1e293b">🗄️ 向量数据库</text>
      <text x="10" y="122" font-size="13" font-weight="bold" fill="#0ea5e9">每次提问（开卷考试）</text>
      <rect x="10" y="134" width="140" height="44" rx="10" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="1.5"/><text x="80" y="161" text-anchor="middle" font-size="12.5" fill="#1e293b">❓ 用户提问</text>
      <line x1="154" y1="156" x2="176" y2="156" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="180" y="134" width="140" height="44" rx="10" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="1.5"/><text x="250" y="161" text-anchor="middle" font-size="12.5" fill="#1e293b">🔍 检索最相关3段</text>
      <line x1="324" y1="156" x2="346" y2="156" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="350" y="134" width="140" height="44" rx="10" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="1.5"/><text x="420" y="161" text-anchor="middle" font-size="12.5" fill="#1e293b">📝 拼进提示词</text>
      <line x1="494" y1="156" x2="516" y2="156" stroke="#475569" stroke-width="2" marker-end="url(#mA4)"/>
      <rect x="520" y="134" width="130" height="44" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/><text x="585" y="161" text-anchor="middle" font-size="12.5" fill="#1e293b">🤖 开卷作答</text>
      <path d="M 585 130 C 585 105 250 105 250 130" stroke="#16a34a" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#mA4)"/>
      <text x="330" y="200" text-anchor="middle" font-size="12" fill="#94a3b8">检索时把问题也转成向量，去向量库里找「意思最相近」的段落——这就是语义搜索</text>
      </svg></div>
      <h3>向量：语义的坐标</h3>
      <p>把每段文字交给<b>嵌入模型（Embedding Model）</b>，变成一串数字（<b>向量</b>）。神奇之处：<b>意思相近的文字，向量距离也近</b>——"年假申请"和"休假流程"的向量非常接近，虽然用词完全不同。检索时，把你的问题也变成向量，找出"距离最近"的几段资料，就是语义搜索。</p>
      <h3>RAG vs 微调怎么选</h3>
      <p>记一条就行：<b>RAG 管"知识"，微调管"风格/技能"</b>。让 AI 懂你们公司的制度、产品文档 → RAG；让 AI 学会特定的输出格式、行业行文风格 → 微调。职场里 90% 的需求是知识问题，选 RAG。</p>
      <h3>不写代码也能体验</h3>
      <p>各类"AI 知识库"产品（如 Coze 知识库、飞书知识问答、ChatGPT 的 GPTs 挂文档）底层都是 RAG。理解了原理，你就知道为什么它们"有时找不到答案"——检索没命中相关段落，而不是模型笨。</p>`,
    cards: [
      { q: "RAG 解决什么问题？四个步骤？", a: "让大模型基于你的资料回答（开卷考试）。四步：文档切块 → 嵌入成向量入库 → 按问题检索最相关段落 → 塞进提示词生成回答。" },
      { q: "为什么向量检索比关键词搜索强？", a: "向量代表语义，意思相近的文字距离相近——「年假申请」能搜到「休假流程」段落，关键词搜索做不到。" },
      { q: "RAG 和微调分别适合什么场景？", a: "RAG 管知识（公司文档、产品手册等会更新的内容）；微调管风格和技能（特定输出格式、行文风格）。90% 职场需求选 RAG。" },
      { q: "RAG 应用「有时答不上」最可能的原因？", a: "检索环节没命中相关段落（切块不合理/问法与资料用词差异大），不是模型本身笨。可优化切块策略或检索数量。" },
      { q: "为什么不直接把所有文档塞进提示词？", a: "上下文窗口装不下；且超长上下文费用高、模型注意力会稀释，中间内容容易被忽略。" }
    ],
    quiz: [
      { q: "RAG 的核心思路是？", options: ["把知识重新训练进模型参数", "先检索相关资料，再让模型开卷作答", "换一个更大的模型"], answer: 1, explain: "RAG = 检索 + 生成：找到相关段落塞进提示词，便宜、即时可更新。" },
      { q: "向量检索比关键词搜索强在哪？", options: ["速度更快", "能按语义匹配——意思相近就能搜到", "完全免费"], answer: 1, explain: "向量代表语义：「年假申请」能命中「休假流程」段落，关键词做不到。" },
      { q: "想让 AI 掌握你们公司的产品手册，应优先选？", options: ["RAG（挂知识库）", "微调", "重新训练一个模型"], answer: 0, explain: "RAG 管知识、更新即生效、成本低；微调管风格技能。知识类需求 90% 选 RAG。" }
    ]
  },
  {
    id: "c8",
    module: "模块三 · 懂原理会搭建",
    title: "AI Agent：让 AI 替你干活",
    subtitle: "从聊天到行动，当前最火的方向",
    why: "Agent = 大模型 + 工具 + 循环。看懂它，你就看懂了 AI 自动化的下一站（也是 vibe coding 的进阶方向）。",
    preview: [
      "普通聊天和 Agent 的本质区别是什么？",
      "「工具调用（Function Calling）」是怎么发生的？",
      "为什么说 Agent 是「循环里的大模型」？",
      "Agent 干砸了会怎样？为什么需要人工把关？"
    ],
    content: `
      <h3>从"会说"到"会做"</h3>
      <p>你问 ChatGPT"帮我订下周三的会议室"，它只能给你一段文字建议，因为它<b>只有嘴，没有手</b>。<b>Agent（智能体）</b>就是给大模型装上手：允许它调用<b>工具</b>——查日历、发邮件、读写文件、操作网页——然后围绕目标自主决定"下一步调哪个工具"，循环执行直到完成。</p>
      <div class="dg"><svg viewBox="0 0 660 210" role="img" aria-label="Agent 循环图">
      <defs><marker id="mA5" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0L9,4.5L0,9z" fill="#475569"/></marker></defs>
      <rect x="10" y="70" width="150" height="64" rx="12" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
      <text x="85" y="96" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">🎯 给个目标</text>
      <text x="85" y="116" text-anchor="middle" font-size="12" fill="#475569">「安排下周会」</text>
      <line x1="164" y1="102" x2="210" y2="102" stroke="#475569" stroke-width="2" marker-end="url(#mA5)"/>
      <rect x="214" y="70" width="160" height="64" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="294" y="96" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">🧠 大模型思考</text>
      <text x="294" y="116" text-anchor="middle" font-size="12" fill="#475569">决定下一步调哪个工具</text>
      <line x1="378" y1="102" x2="424" y2="102" stroke="#475569" stroke-width="2" marker-end="url(#mA5)"/>
      <rect x="428" y="70" width="160" height="64" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="508" y="96" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">🔧 执行工具</text>
      <text x="508" y="116" text-anchor="middle" font-size="12" fill="#475569">查日历/发邮件/读文件</text>
      <path d="M 508 138 C 508 190 294 190 294 142" stroke="#0ea5e9" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#mA5)"/>
      <text x="400" y="182" text-anchor="middle" font-size="12" fill="#0ea5e9">结果喂回模型 → 继续思考 → 直到任务完成（循环）</text>
      <text x="330" y="34" text-anchor="middle" font-size="13" fill="#64748b">模型是「大脑」只发指令，你的程序是「手脚」真正执行</text>
      <text x="330" y="56" text-anchor="middle" font-size="12" fill="#dc2626">⚠️ 发邮件、下单等高风险动作前，务必设计「人工确认」环节 🙋</text>
      </svg></div>
      <h3>工具调用（Function Calling）的原理</h3>
      <p>其实没有魔法：你提前告诉模型"你有这些工具可用，每个工具需要什么参数"。模型遇到任务时，<b>输出一段结构化文字表示"我要调用查日历工具，参数是下周三"</b>，<b>真正的执行是你的程序完成的</b>，执行结果再喂回给模型，它据此继续思考。模型是"大脑"，你的代码是"手脚"。</p>
      <h3>Agent = 循环里的大模型</h3>
      <p>一个最小 Agent 的伪代码：<code class="inline">while 未完成：让模型思考 → 模型选择工具 → 程序执行工具 → 结果喂回模型</code>。听起来简单，但这个循环让"查资料→汇总→写邮件→发送"这类多步骤任务可以自动完成。OpenAI、Anthropic 的 Agent 功能，以及国内的 Coze、影刀 AI，底层都是这个模式。</p>
      <h3>MCP：AI 工具的 USB 接口</h3>
      <p>每接一个新工具都要写一遍对接代码，很繁琐。<b>MCP（模型上下文协议）</b>是 2024 年底出现的开放标准：工具方按 MCP 规范提供一次，各种 AI 应用（Claude、Cursor 等）都能即插即用——像 USB 一样统一了接口。你以后会经常看到"某软件已支持 MCP"。</p>
      <h3>清醒看待：循环会放大错误</h3>
      <p>每一步 90% 的准确率，十步连乘只剩 35%。所以现实中 Agent 适合<b>步骤可验证、错了成本低</b>的任务（信息汇总、草稿生成、代码生成+自动测试），重要动作（发邮件、下单、删数据）一定要设计<b>人工确认</b>环节。职场用 Agent 的正确姿势：先在小事上试跑，逐步放权。</p>`,
    cards: [
      { q: "Agent 和普通聊天机器人的本质区别？", a: "Agent = 大模型 + 工具 + 自主循环：能调用工具（查日历、发邮件、读写文件）并自主决定下一步，直到完成目标；聊天机器人只能输出文字。" },
      { q: "工具调用（Function Calling）是怎么执行的？", a: "模型只输出「我想调某工具+参数」的结构化文本，真正执行是你的程序完成的，结果再喂回模型继续思考。模型是大脑，程序是手脚。" },
      { q: "用一句话写出最小 Agent 的结构？", a: "while 未完成：模型思考 → 选择工具 → 程序执行 → 结果喂回。Agent 就是循环里的大模型。" },
      { q: "MCP 是什么？解决什么问题？", a: "模型上下文协议，AI 工具的统一接口标准（像 USB）：工具方按规范提供一次，各种 AI 应用都能即插即用，免去重复对接。" },
      { q: "为什么 Agent 需要人工确认环节？", a: "误差会随步骤连乘放大（每步 90% 准确率，十步后仅 35%）。高风险动作（发邮件、下单、删数据）必须设计人工确认。" }
    ],
    quiz: [
      { q: "Agent 与普通聊天机器人的本质区别是？", options: ["界面更好看", "能调用工具并自主循环执行任务", "回答速度更快"], answer: 1, explain: "Agent = 大模型 + 工具 + 循环，从「会说」升级到「会做」。" },
      { q: "工具调用时，真正执行操作的是？", options: ["大模型自己", "你的程序（模型只发出调用指令）", "网络运营商"], answer: 1, explain: "模型是大脑只输出「我要调什么工具+参数」，执行由你的代码完成。" },
      { q: "为什么 Agent 的高风险动作要加人工确认？", options: ["走个流程而已", "每步误差连乘放大，多步后错误率很高", "法律强制要求所有 AI 行为都要确认"], answer: 1, explain: "每步 90% 准确率，十步连乘只剩 35%。发邮件、下单、删数据必须人审。" }
    ]
  },
  {
    id: "c9",
    module: "模块三 · 懂原理会搭建",
    title: "数据安全与职场合规",
    subtitle: "别让 AI 变成公司的泄密口",
    why: "用 AI 的最大职场风险不是用不好，而是用出事故。这一课帮你建立安全底线。",
    preview: [
      "把客户名单贴给公开大模型，风险在哪里？",
      "你输入的内容会被用来训练模型吗？",
      "「脱敏」具体要做什么？",
      "公司应该怎么选 AI 工具的部署方式？"
    ],
    content: `
      <h3>三个真实风险</h3>
      <ul>
        <li><b>数据外流</b>：你发给公开大模型的内容，会经过厂商的服务器。虽然主流厂商承诺不用企业版数据训练，但个人版条款不同；更别说第三方小工具的去向不明。客户名单、财务明细、未公开战略——这些贴进对话框的一刻就离开了你的控制。</li>
        <li><b>合规红线</b>：个人信息保护法、行业监管（金融、医疗尤其严格）对数据出域有明确要求。用 AI 泄露客户信息，责任人是使用者和其公司。</li>
        <li><b>隐性依赖</b>：把核心资料存进某个 AI 工具，工具停服或涨价时（AI 领域常见）业务被卡脖子。</li>
      </ul>
      <h3>脱敏：最小成本的保命技巧</h3>
      <p>让 AI 分析数据时，把敏感字段替换成代号："客户A、华东区、金额 45 万"。AI 需要的是<b>结构和模式</b>，不需要真实姓名。手机号、身份证、账号一律不放。这个习惯能挡住 80% 的风险。</p>
      <div class="dg"><svg viewBox="0 0 660 110" role="img" aria-label="脱敏示例">
      <rect x="10" y="20" width="300" height="70" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="160" y="48" text-anchor="middle" font-size="13" font-weight="bold" fill="#dc2626">❌ 原样贴出去</text>
      <text x="160" y="72" text-anchor="middle" font-size="12.5" fill="#475569">张伟 138****1234 金额 45 万 · 华东区</text>
      <rect x="350" y="20" width="300" height="70" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="500" y="48" text-anchor="middle" font-size="13" font-weight="bold" fill="#16a34a">✅ 脱敏后再贴</text>
      <text x="500" y="72" text-anchor="middle" font-size="12.5" fill="#475569">客户A 机型X 金额 45 万 · 华东区</text>
      </svg></div>
      <h3>企业级的选型阶梯</h3>
      <ul>
        <li><b>公开个人版</b>（免费/20美元）：只放公开信息和自己可负责的内容。</li>
        <li><b>企业版 API / 企业账号</b>：厂商承诺数据不用于训练、有管理后台，适合团队日常使用。</li>
        <li><b>私有化部署</b>：开源模型（如 Qwen、DeepSeek、Llama）部署在公司自己服务器上，数据不出门。成本高，适合强监管行业。</li>
      </ul>
      <h3>发给团队的实用清单</h3>
      <ul>
        <li>贴给 AI 前问自己：这段内容流出去，最坏会怎样？</li>
        <li>客户数据、财务数据、密码密钥：默认不贴，需脱敏。</li>
        <li>AI 生成的对外内容：事实和数字人工核验（防幻觉+防责任）。</li>
        <li>公司若没有明确规范：推动制定一份"AI 使用三行守则"，这本身就是职场加分项。</li>
      </ul>`,
    cards: [
      { q: "职场使用公开 AI 的三大风险？", a: "数据外流（内容离开你的控制）、合规红线（个保法/行业监管，责任人是你）、隐性依赖（工具停服卡脖子）。" },
      { q: "脱敏怎么做？为什么有效？", a: "把敏感字段替换成代号（客户A、金额45万），隐藏姓名/手机号/账号。AI 分析靠的是结构和模式，不需要真实身份数据。" },
      { q: "企业 AI 工具选型的三个阶梯？", a: "公开个人版（只放公开信息）→ 企业版/API（数据不用于训练、有管控）→ 私有化部署开源模型（数据不出门，强监管行业用）。" },
      { q: "贴内容给 AI 前的必答一问是什么？", a: "「这段内容如果流出去，最坏会怎样？」——用最坏情况判断是否脱敏或不贴。" },
      { q: "AI 生成的对外内容，为什么必须人工核验？", a: "两个原因：幻觉可能编造事实数字；对外承诺的责任归属在你和你的公司，AI 不担责。" }
    ],
    quiz: [
      { q: "把带客户真实姓名和手机号的表格贴给公开 AI，最大的问题是？", options: ["AI 分析不了表格", "敏感数据外流，可能违反个人信息保护法", "会让 AI 变笨"], answer: 1, explain: "数据一旦贴出就离开你的控制，且个保法对数据出域有明确要求。" },
      { q: "正确的脱敏做法是？", options: ["把手机号换成 138****1234 就够了", "姓名、手机号、账号全部换成代号后再贴", "只删掉金额数字"], answer: 1, explain: "AI 分析靠结构和模式，不需要真实身份信息——客户A、机型X 就够了。" },
      { q: "对数据安全要求最高的公司，应选择哪种部署方式？", options: ["公开个人版", "企业版 API", "开源模型私有化部署在自家服务器"], answer: 2, explain: "私有化部署数据不出门；个人版最弱，企业版居中。" }
    ]
  },
  {
    id: "c10",
    module: "模块三 · 懂原理会搭建",
    title: "职场 AI 学习路线图",
    subtitle: "把碎片连成体系，规划你的下一站",
    why: "收尾课：把前面所学连成一张地图，并给你可直接跟进的优质资源。",
    preview: [
      "职场 AI 能力树有哪几层？你现在的位置在哪？",
      "每周固定投入多少时间，三个月能达到什么水平？",
      "GitHub 上有哪些值得长期跟进的免费课程？",
      "怎么判断一个新 AI 工具值不值得学？"
    ],
    content: `
      <h3>职场 AI 能力树（你现在在哪一层？）</h3>
      <div class="dg"><svg viewBox="0 0 660 150" role="img" aria-label="能力树">
      <rect x="10"  y="105" width="580" height="30" rx="8" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="1.5"/>
      <text x="300" y="125" text-anchor="middle" font-size="13" fill="#1e293b"><tspan font-weight="bold">L1 会话</tspan>　会用 ChatGPT 问问题（多数人在这里）</text>
      <rect x="70"  y="70"  width="520" height="30" rx="8" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="330" y="90" text-anchor="middle" font-size="13" fill="#1e293b"><tspan font-weight="bold">L2 会用</tspan>　提示词框架 · 文档速读 · 会议纪要（模块二目标）</text>
      <rect x="130" y="35"  width="460" height="30" rx="8" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/>
      <text x="360" y="55" text-anchor="middle" font-size="13" fill="#1e293b"><tspan font-weight="bold">L3 会搭</tspan>　懂前后端和 API，vibe coding 做出真工具（模块一+三目标）</text>
      <rect x="190" y="0"   width="400" height="30" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="390" y="20" text-anchor="middle" font-size="13" fill="#1e293b"><tspan font-weight="bold">L4 会选型</tspan>　评估方案、定安全边界（稀缺定位）</text>
      </svg></div>
      <h3>三个月成长节奏（参考）</h3>
      <ul>
        <li><b>第 1 个月</b>：完成本应用全部课程 + 每天用提示词框架解决一个真实工作任务。</li>
        <li><b>第 2 个月</b>：vibe coding 做一个真实的小工具（如团队周报汇总页、个人知识库），按验收清单上线给同事用。</li>
        <li><b>第 3 个月</b>：搭一个 RAG 知识库（用 Coze/Dify 零代码平台即可）+ 跑通一个 Agent 工作流，复盘写成一页文档。</li>
      </ul>
      <h3>值得长期跟进的免费资源</h3>
      <ul>
        <li><a href="https://github.com/microsoft/generative-ai-for-beginners" target="_blank">microsoft/generative-ai-for-beginners</a>：21 课生成式 AI 应用开发（微软官方，含视频）。</li>
        <li><a href="https://github.com/microsoft/ai-agents-for-beginners" target="_blank">microsoft/ai-agents-for-beginners</a>：Agent 开发入门（11 课）。</li>
        <li><a href="https://github.com/mlabonne/llm-course" target="_blank">mlabonne/llm-course</a>：进阶 LLM 工程系统课程（8 万+ star）。</li>
        <li><a href="https://roadmap.sh/ai-engineer" target="_blank">roadmap.sh/ai-engineer</a>：AI 工程师技能地图（查漏补缺用）。</li>
      </ul>
      <h3>新工具值不值得学？三个判断</h3>
      <ol>
        <li>它解决的是你每周真实遇到的问题吗？（不解决→观望）</li>
        <li>它是标准化方向（如 RAG、Agent），还是噱头？（标准化→早学红利大）</li>
        <li>学习成本低于你省下的时间吗？（花 5 小时学、每周省 2 小时→三周回本）</li>
      </ol>
      <h3>最后的话</h3>
      <p>AI 工具每季度都在换，但<b>「懂原理 + 会验收 + 守安全」这三件事不会过时</b>。用本应用的复习卡片保持记忆，用真实项目驱动学习，你就是团队里那个"懂 AI 的人"。</p>`,
    cards: [
      { q: "职场 AI 能力树的四层分别是什么？", a: "L1 会话（会用ChatGPT）→ L2 会用（提示词、文档处理）→ L3 会搭（vibe coding 做工具/知识库）→ L4 会选型（评估方案、定安全边界）。" },
      { q: "判断新 AI 工具值不值得学的三条标准？", a: "①是否解决每周真实遇到的问题；②是否为标准化方向（RAG/Agent）而非噱头；③学习成本是否低于省下的时间。" },
      { q: "三个月成长节奏怎么安排？", a: "第1月：学完课程+每日提示词实战；第2月：vibe coding 做真实小工具并上线；第3月：搭 RAG 知识库+跑通 Agent 工作流并复盘。" },
      { q: "说出两个值得长期跟进的免费学习资源", a: "microsoft/generative-ai-for-beginners（21课）、microsoft/ai-agents-for-beginners（11课）、mlabonne/llm-course、roadmap.sh/ai-engineer。" },
      { q: "AI 时代不会过时的三件事是什么？", a: "懂原理（理解机制才能预判表现）、会验收（小步验证+安全检查）、守安全（脱敏、人工核验、合规）。" }
    ],
    quiz: [
      { q: "「能评估该不该用 AI、帮团队定方案、定安全边界」属于能力树哪一层？", options: ["L2 会用", "L3 会搭", "L4 会选型"], answer: 2, explain: "L4 会选型是 AI 时代职场人的稀缺定位。" },
      { q: "判断新 AI 工具值不值得学，下面哪条不是标准？", options: ["是否解决你每周真实遇到的问题", "是不是标准化方向（如 RAG/Agent）", "是不是大公司出品"], answer: 2, explain: "厂商大小不是标准；问题是否真实、方向是否标准化、回本周期才是。" },
      { q: "AI 工具每季度都在换，不会过时的三件事是？", options: ["懂原理、会验收、守安全", "记快捷键、囤教程、追发布会", "买课、考证、转发文章"], answer: 0, explain: "理解机制、小步验证、守住安全底线——这些能力可以迁移到任何新工具。" }
    ]
  }
];

/* 能力测评：10 题，三个维度 */
const QUIZ = [
  { id: "q1", dim: "web", q: "你在浏览器里看到的网页界面，主要由什么代码负责显示？",
    options: ["前端代码（HTML/CSS/JS）", "后端服务器程序", "数据库", "不确定"],
    answer: 0, map: ["c1"],
    explain: "界面显示是前端的事；后端在服务器上处理逻辑，数据库存数据。" },
  { id: "q2", dim: "web", q: "你在网页上点「提交订单」，订单数据最终被存放在哪里？",
    options: ["你的浏览器里", "后端服务器连接的数据库", "前端代码文件里", "不确定"],
    answer: 1, map: ["c1"],
    explain: "重要数据都存数据库，浏览器里只放临时展示数据。" },
  { id: "q3", dim: "web", q: "前端和后端互相独立，它们之间靠什么传递数据？",
    options: ["API（接口请求）", "复制粘贴", "共享同一个文件", "不确定"],
    answer: 0, map: ["c1", "c6"],
    explain: "前后端通过 API 请求/响应传数据；调用大模型也是同样的方式。" },
  { id: "q4", dim: "ai", q: "大模型（如 ChatGPT）生成一段话时，每一步本质上在做什么？",
    options: ["从资料库里检索现成答案", "预测下一个词的概率（接龙）", "播放预先写好的模板", "不确定"],
    answer: 1, map: ["c2"],
    explain: "本质是文字接龙：根据前文预测下一个词，循环生成。" },
  { id: "q5", dim: "ai", q: "大模型「一本正经地编造不存在的事实」，这种现象叫什么、为什么发生？",
    options: ["病毒，模型中毒了", "幻觉：它按概率生成，没学过也会编出像样的答案", "网速太慢导致乱码", "不确定"],
    answer: 1, map: ["c2"],
    explain: "模型优化的是「接得像」而非「说得对」，这就是幻觉。" },
  { id: "q6", dim: "ai", q: "和 AI 聊了很久之后它「忘了」开头说的话，是因为什么？",
    options: ["它故意装忘", "上下文窗口有限，超出的内容不再参与计算", "你的账号等级不够", "不确定"],
    answer: 1, map: ["c2"],
    explain: "上下文窗口是模型的工作记忆上限，超出窗口即遗忘。" },
  { id: "q7", dim: "app", q: "想让 AI 准确回答「你公司文档里写了什么」，业界最主流的技术是？",
    options: ["重新训练一个专属大模型", "RAG：检索相关段落塞进提示词，让它开卷考试", "每天人工教它一遍", "不确定"],
    answer: 1, map: ["c7"],
    explain: "RAG 便宜、即时更新，是企业知识库的主流方案；微调贵且难更新。" },
  { id: "q8", dim: "app", q: "「AI 自己调用日历、发邮件、查资料，连续完成多步任务」指的是什么？",
    options: ["语音识别", "AI Agent（智能体）：大模型+工具+自主循环", "聊天机器人", "不确定"],
    answer: 1, map: ["c8"],
    explain: "Agent 能调用工具并自主决定下一步，从「会说」升级到「会做」。" },
  { id: "q9", dim: "app", q: "AI 帮你生成了一段代码，功能看着正常，上线前你最先应该做什么？",
    options: ["直接上线，AI 写的一般没错", "自己跑一遍核心功能+检查密钥是否明文+让 AI 自审安全风险", "再让另一个 AI 重写一遍", "不确定"],
    answer: 1, map: ["c4"],
    explain: "AI 代码最大的风险是不报错的「隐雷」（安全漏洞、数据不持久化），必须验收。" },
  { id: "q10", dim: "app", q: "把带客户真实姓名和手机号的表格直接贴给公开 AI 分析，最大的问题是？",
    options: ["AI 分析不了表格", "敏感数据外流，可能违反个人信息保护法", "会让 AI 变笨", "不确定"],
    answer: 1, map: ["c9"],
    explain: "敏感数据应先脱敏（客户A、手机号打码）再喂给 AI。" }
];
const QUIZ_DIMS = { web: "互联网基础", ai: "AI 原理", app: "AI 应用与职场" };

/* 伴学术语库：页面里的术语会自动标虚线，点击即弹出通俗解释 */
const GLOSSARY = [
  { term: "前端", plain: "运行在用户浏览器里的程序，负责你看到和点击的一切界面。三件套：HTML（骨架）、CSS（外观）、JavaScript（动作）。就像餐厅大堂。" },
  { term: "后端", plain: "运行在服务器上的程序，用户看不见，负责真正的业务逻辑：校验密码、处理订单、计算数据。就像餐厅后厨。" },
  { term: "数据库", plain: "专门安全存放数据的软件（如 MySQL）。数据写进去不会因刷新页面丢失，还能快速查询。就像餐厅仓库。" },
  { term: "API", plain: "程序之间约定的对话方式：按规定格式发请求、收响应，彼此不用了解内部实现。像餐厅服务员或外卖取餐口。调用 ChatGPT 本质就是调 API。" },
  { term: "API Key", plain: "调用 API 的密钥 = 身份证 + 钱包：证明你是谁、按用量扣费。泄露会被盗刷，所以只能放后端服务器，绝不写在前端代码里。" },
  { term: "部署", plain: "把写好的代码放到服务器上运行，让全世界能通过网址访问。静态网站可用 GitHub Pages（免费），复杂应用用云服务器。" },
  { term: "服务器", plain: "一台 24 小时开机、放在机房里的电脑，专门跑后端程序和存数据。'云服务器'就是租来的这种电脑。" },
  { term: "环境变量", plain: "存在服务器配置里、不写进代码文件的敏感信息（如 API Key、密码）。程序运行时读取，这样代码分享出去也不会泄露密钥。" },
  { term: "Token", plain: "（词元）模型处理文本的最小单位，一个汉字约 1-2 个 token。大模型按 token 计费、限制上下文长度。注意和'登录令牌 token'是两个概念。" },
  { term: "上下文窗口", plain: "模型一次能处理的文字总量上限（如 128K token ≈ 一本长篇小说），相当于工作记忆。聊太久超出窗口，开头的内容就被'遗忘'。" },
  { term: "幻觉", plain: "大模型一本正经编造不存在事实的现象。原因是它优化的是「接得像」而不是「说得对」。对策：RAG、要求给出来源、人工核实。" },
  { term: "温度", plain: "Temperature，调用模型 API 的'创造力旋钮'：调低输出稳定刻板（适合提取数据），调高更有创意但不稳定（适合头脑风暴）。" },
  { term: "训练", plain: "让模型读海量文本、调整数千亿参数的学习过程，要几万张显卡跑几个月，极贵。我们平时用模型是'推理'，不是训练。" },
  { term: "推理", plain: "训练好的模型被使用的过程：你问、它答。每次回答背后是几亿次计算，所以按 token 收费。" },
  { term: "参数", plain: "模型内部的可调节旋钮（GPT 级别有数千亿个）。训练就是调这些旋钮让预测更准；参数量常用来描述模型大小。" },
  { term: "提示词", plain: "Prompt，你发给 AI 的指令。好的提示词包含：角色、背景、任务、格式、示例（口诀：角背任格例）。" },
  { term: "few-shot", plain: "少样本示例：在提示词里贴 1-2 个你期望的输出样子，让 AI 模仿。比纯文字描述格式和口吻的命中率高得多。" },
  { term: "微调", plain: "Fine-tune，拿自己的数据继续训练模型，改变它的'风格/技能'。贵、慢、更新难；教知识不如用 RAG。" },
  { term: "RAG", plain: "检索增强生成：先从你的资料里检索相关段落，塞进提示词让模型'开卷考试'。四步：切块→向量化→检索→生成。企业知识库的主流方案。" },
  { term: "嵌入", plain: "Embedding，把一段文字变成一串数字（向量）的技术。意思相近的话，向量距离也近——语义搜索的基础。" },
  { term: "向量", plain: "一串代表文字语义的数字。'年假申请'和'休假流程'用词不同但向量很近，所以能互相搜到。" },
  { term: "向量数据库", plain: "专门存向量、按'距离最近'快速检索的数据库（如 Milvus、pgvector）。RAG 的核心组件。" },
  { term: "Agent", plain: "智能体：大模型 + 工具 + 自主循环。给它一个目标，它会自己决定调用什么工具（查日历、发邮件）、循环执行直到完成。" },
  { term: "工具调用", plain: "Function Calling：模型输出'我要调某工具+参数'的指令，真正的执行是你的程序完成，结果再喂回模型。模型是大脑，程序是手脚。" },
  { term: "MCP", plain: "模型上下文协议，AI 工具的统一接口标准（像 USB）：工具方按规范提供一次，各种 AI 应用都能即插即用。" },
  { term: "工作流", plain: "把重复任务固化为自动执行的步骤链（如每周一自动汇总数据生成周报）。工具：影刀、n8n、飞书机器人，或 vibe coding 写脚本。" },
  { term: "脱敏", plain: "把敏感信息换成代号再给 AI（张伟→客户A，手机号→隐去）。AI 分析靠结构和模式，不需要真实身份，能挡住大部分泄密风险。" },
  { term: "git", plain: "版本管理工具：git commit 是存档点，写坏了随时回滚；git checkout . 丢弃未提交的修改回到上个存档。vibe coding 的救命绳。" },
  { term: "开源模型", plain: "公开 downloadable 权重的模型（如 Qwen、DeepSeek、Llama），可以下载到自己服务器部署，数据不出门。" },
  { term: "私有化部署", plain: "把模型装在公司自己的服务器上运行，数据完全不经过外部。成本高，适合金融、医疗等强监控行业。" }
];
