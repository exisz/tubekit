# ROADMAP — starmap-template

> 帝国 **默认栈** —— Next.js + Prisma + Turso + Tailwind v4 + DaisyUI 单 app。
>
> 当前服务于 Starmap 100 站扩张计划的 ~80% 站点。此文档列出未来需要补充到 template 的能力，按优先级排序。

## 设计原则（写在前面）

1. **Core 保持精瘦** —— 现有 package.json 不要无脑增加依赖
2. **新增能力做成"模块"（modules/）** —— 可选，按需拷贝，bootstrap 时 `--with-xxx` 启用
3. **每个模块必须有**：README + 要复制的文件清单 + env vars 清单 + golden example 链接（引用一个已用过该模块的活站）
4. **拒绝未定型的技术进 template** ——
   - ✅ 进：已跑过 ≥3 个生产站的东西
   - ❌ 不进：pre-1.0、实验性、被单一厂商锁死的 SaaS

---

## 🔴 P0 — 必加（每建新站都在重复造）

### 1. Logto SSO 模块 `modules/auth-logto/`
**现状：** RandomPage / Tarot / GenStack-SPA-Astro 每个都手搓 4 个 route handler + env vars
**加法：**
- 4 个 route handler 文件（sign-in / sign-out / callback / api/logto/[...logto]）
- `src/lib/logto.ts` 客户端单例
- `starmap bootstrap xxx --with-auth` 自动：
  1. 调 Logto M2M API 注册应用（redirect URI 用 `*.starmap.quest`）
  2. 写 5 个 env vars 到 Vercel 三环境
  3. 拷贝 module 文件到站点
  4. `app/(auth)` 目录带 sign-in 按钮 DaisyUI 样板
- **环境变量：** `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_BASE_URL`, `LOGTO_COOKIE_SECRET`
- **Golden example：** `/Users/c/starmap/randompage/`

**ROI：** 每个需要登录的站省 30-60 分钟

### 2. SEO 骨架 `modules/seo/`
**现状：** 每站都手写 sitemap / robots / JSON-LD，格式参差
**加法：**
- `src/app/sitemap.ts` —— 读 DB 或 JSON 数据源自动生成
- `src/app/robots.ts` —— 标准版（区分 production/preview）
- `src/lib/jsonld.ts` —— 工具函数集：`articleJsonLd()`, `productJsonLd()`, `faqJsonLd()`, `breadcrumbJsonLd()`, `softwareAppJsonLd()`
- `src/components/JsonLd.tsx` —— `<script type="application/ld+json">` 注入组件
- Meta tags helper（og、twitter card、canonical）

**ROI：** 帝国靠 SEO 吃饭，这是刚需。每站省 30-60 分钟 + SEO 质量一致

### 3. Error / 404 / 500 统一兜底页 `modules/error-pages/`
**现状：** 每站用 Next 默认 error 页，丑，无品牌
**加法：**
- `app/not-found.tsx` 带 DaisyUI 样式 + 返回首页按钮 + 显示 "Starmap 出品" 帝国交叉导流小链接
- `app/error.tsx` + `app/global-error.tsx` 统一样式
- `app/loading.tsx` 骨架屏模板（Skeleton）

**ROI：** 一次性加进 core（不做模块化，直接进），每站立即生效

### 4. OG Image 动态生成 `modules/og-image/`
**现状：** 每站分享到社交都是默认丑图
**加法：**
- `app/og/route.tsx` 用 `next/og` 生成动态 OG 图
- 默认模板：站点 logo + 标题 + 副标题，带帝国水印
- 自定义 hook：站点可以注册自己的 OG 变体（`og/article`, `og/product`）

**ROI：** 社交分享转化率提升，SEO 加分

---

## 🟡 P1 — 高价值（做成可选模块）

### 5. i18n 脚手架 `modules/i18n-next-intl/`
**触发条件：** 帝国未来做多语言站（中/英）
**方案：** `next-intl`（事实标准）
- `messages/en.json` + `messages/zh.json` 骨架
- `[locale]/` 路由段
- `middleware.ts` 语言检测
- `--with-i18n` 开启（默认关闭）

### 6. 订阅 / 支付模块 `modules/billing-stripe/` 或 `modules/billing-creem/`
**现状：** GameTally / Tarot 升级 premium 时都要从零写
**决策点：** Stripe vs Creem —— ⚠️ 待陛下定调
- Stripe：AU 公司实体门槛
- Creem：个人友好、AU 可用
**加法：**
- `src/lib/billing.ts`
- `app/api/webhooks/stripe/route.ts`（或 creem）
- `app/pricing/page.tsx` DaisyUI 样板
- Prisma schema 里的 `Subscription` model 注释样板
- Env vars：`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`

**ROI：** 一个付费站就能回本

### 7. Email 发送 `modules/email-resend/`
**现状：** 没有。验证邮件、通知都手搓
**方案：** Resend（免费 3K/月）+ react-email 写模板
**加法：**
- `src/lib/email.ts` Resend 封装
- `emails/` 目录用 react-email 组件写模板
- Env vars：`RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### 8. Scraping 脚本骨架 `modules/scraper/`
**现状：** `pnpm scrape` 是占位符。帝国大量站要数据
**加法：**
- `scripts/scrape/` 目录结构
- Firecrawl / Crawl4AI 调用样板（集成 web-crawl skill）
- `rate_limit_guard.py` 引用样板（参考 STAR-ing 工作区 `/Users/c/starmap/scripts/`）
- JSON → Turso 批量导入脚本 `scripts/seed-turso.mjs`
- SearXNG 调用样板（`http://localhost:8888`）

---

## 🟢 P2 — 锦上添花

### 9. Feature flags `modules/feature-flags/`
- Turso 表 + `src/lib/flags.ts`
- 支持 % rollout + user-targeted
- 帝国 A/B 测试用

### 10. Admin dashboard 骨架 `modules/admin/`
- `app/(admin)/admin/page.tsx` —— Logto role `admin` 才能看
- 默认 widgets：用户列表、DB 快照、流量
- Golden example：待定

### 11. AI / LLM 调用 helper `modules/ai/`
- `src/lib/ai.ts` 封装 OpenAI / Anthropic / 可换
- **带 cost tracking**（帝国有 $5/年/站铁律）
- `src/lib/ai-cost.ts` 累计到 Turso 表
- Env vars：`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_MONTHLY_BUDGET_AUD`

### 12. Testing 脚手架 `modules/testing/`
- Vitest 单元测试
- Playwright smoke test（至少"访问首页返 200"）
- `/api/health` endpoint 标准化

### 13. CI / GitHub Actions `modules/ci/`
- `.github/workflows/ci.yml` —— lint + type-check + smoke test on PR
- `.github/workflows/deploy.yml` —— 如需要脱离 Vercel auto-deploy

### 14. Analytics 补全
- 已有 Vercel Analytics + Speed Insights
- 加 GA4 可选（`NEXT_PUBLIC_GA_ID`）
- 加 PostHog 可选（产品分析）

---

## CLI 扩展（`starmap-cli`）

要让上面这些 module 真正好用，`starmap bootstrap` 必须支持 `--with-*` 标志：

```bash
starmap bootstrap mysite \
  --ticket STAR-N \
  --title "Title" \
  --description "Desc" \
  --with-auth \
  --with-seo \
  --with-stripe \
  --with-scraper
```

CLI 要做的事：
1. 读 `modules/<name>/manifest.json` 拿文件列表 + env vars + npm deps
2. 拷贝文件到新站（智能 merge，不覆盖已有文件）
3. `pnpm add` 依赖
4. 对 Logto / Stripe 类模块，调各自 API 注册应用 + 写 Vercel env
5. 在新站的 README 里标注"已启用模块"

---

## 执行顺序建议

| Sprint | 内容 | 天数 |
|--------|------|------|
| Sprint 1 | P0：Logto 模块 + SEO 骨架 + Error pages + OG image | 1-2 天 |
| Sprint 2 | P1：Stripe/Creem + Email + Scraping + `starmap bootstrap --with-*` CLI | 1-2 天 |
| Sprint 3 | P2：其余锦上添花项，有空时做 | 随缘 |

---

## 决策待定（陛下拍板）

- [ ] **订阅用 Stripe 还是 Creem？**（AU 实体 vs 个人友好）
- [ ] **Email 用 Resend 还是 SES？**（简单免费 vs 便宜自托管）
- [ ] **AI helper 支持哪些厂商？**（全部 vs OpenAI+Anthropic 两家）
- [ ] **CLI 谁改？**（陛下自己 / 派 pod）

---

## 铁律保留

- 🚫 **不进 template：** TanStack Start、shadcn/ui（如与 DaisyUI 冲突）、Clerk/Auth0（proprietary）、pre-1.0 任何东西
- 🚫 **不做：** 把现在能工作的东西换掉（DaisyUI 就是 DaisyUI，Prisma 就是 Prisma）
- ✅ **只做：** 把已跑通 ≥3 站的经验沉淀成模块

---

**最后更新：** 2026-04-17 | **维护：** Starmap 探索星舰指挥官
