# aozaki-next-blog 项目完全解析文档

> 源项目：[aozaki-kuro/aozaki-next-blog](https://github.com/aozaki-kuro/aozaki-next-blog)
> 解析日期：2026-07-03

---

## 一、项目概览

这是一个 **个人博客**，基于 **Next.js 15 + Nextra 3** 构建，使用 **TypeScript + Tailwind CSS**。原博主 Aozaki 是一位上海的 Cardiologist（心内科医生），博客内容涵盖生活、摄影、插画委托（commission）等。

| 维度 | 详情 |
|------|------|
| 框架 | Next.js 15 (Pages Router) |
| 文档引擎 | Nextra 3 + `nextra-theme-blog` |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 + 自定义 CSS |
| 包管理 | Bun (lockfile 为 `bun.lockb`) |
| 部署 | Cloudflare Pages / Vercel |
| 内容格式 | MDX / Markdown（frontmatter + 内容） |

---

## 二、目录结构总览

```
Blog_Project/
├── .husky/                  # Git Hooks (pre-commit 检查)
├── .mise.toml              # mise 工具配置（指定 node 版本）
├── .prettierignore          # Prettier 忽略文件
├── .prettierrc.js           # Prettier 代码格式化配置
├── bun.lockb                # Bun 依赖锁文件（相当于 package-lock.json）
├── eslint.config.mjs        # ESLint 代码检查配置
├── next.config.ts           # Next.js 核心配置（Nextra、安全头、重定向、代理）
├── package.json             # 项目元信息、依赖、脚本
├── postcss.config.mjs       # PostCSS 配置（Tailwind 需要）
├── renovate.json            # Renovate 自动依赖更新配置
├── tailwind.config.ts       # Tailwind CSS 配置（颜色、字体、断点）
├── theme.config.tsx          # Nextra 主题配置（导航栏、页脚、SEO）
├── tsconfig.json             # TypeScript 配置（路径别名、严格模式）
├── vercel.json               # Vercel 部署配置（重定向）
├── wrangler.toml             # Cloudflare Pages 部署配置
├── README.md                 # 项目说明
│
├── components/               # React 组件
│   ├── analytics.tsx         # 统计脚本（Plausible Analytics）
│   ├── custom-head.tsx        # 自定义 <head>（SEO、OG 标签）
│   ├── open-graph.tsx         # Open Graph 卡片组件（链接预览卡片）
│   ├── posts.tsx              # 博客文章列表组件（首页文章列表）
│   ├── commission/            # 插画委托相关组件
│   │   ├── featured.tsx       # 精选委托展示
│   │   ├── illustrator-info.tsx # 画师信息展示
│   │   ├── list.tsx           # 按角色筛选的委托列表
│   │   ├── stale.tsx          # 已过气委托（懒加载）
│   │   └── types.ts          # 组件类型定义
│   └── photography/           # 摄影相关组件
│       └── photo.tsx          # 摄影作品展示组件
│
├── data/                      # 数据层
│   ├── types.ts               # 委托数据类型定义
│   ├── CommissionData.ts       # 委托数据汇总
│   ├── PhotographyData.ts      # 摄影作品数据
│   ├── PriorityList.ts         # 画师优先级排序
│   └── commission/             # 每个角色的委托数据
│       ├── Alba_sera.ts
│       ├── Laxy.ts
│       ├── Lucia.ts
│       └── Stale/              # 过气委托数据
│
├── drafts/posts/               # 草稿文章（不会被发布）
│   └── wet-shaving.md
│
├── pages/                      # Next.js 页面（也是博客内容）
│   ├── _app.tsx                # 全局 App 组件（字体加载、RSS 链接、统计）
│   ├── _document.tsx           # HTML 文档结构（lang、body 样式）
│   ├── index.mdx               # 首页 / About 页面
│   ├── posts.mdx                # 博客文章列表页
│   ├── commission.mdx           # 插画委托展示页
│   ├── photography.md           # 摄影作品索引页
│   ├── posts/                   # 博客文章（Markdown/MDX）
│   │   ├── api-handling-with-nextjs-13.md
│   │   ├── bladerunner-revisit.md
│   │   ├── boris-johnson-resignation-expected.md
│   │   ├── ... (共约15篇)
│   └── photography/             # 摄影详情页（每个作品一个 MDX）
│       ├── awareness.mdx
│       ├── blossom.mdx
│       └── ... (共约10个)
│
├── public/                      # 静态资源
│   ├── favicon.ico
│   ├── logo.png
│   ├── site.webmanifest         # PWA 配置
│   ├── _headers                 # Cloudflare Pages 安全头
│   ├── feed.xml                 # RSS Feed（构建时生成）
│   ├── fonts/                   # 字体文件（Inter、Menlo）
│   ├── icons/                   # PWA 图标（各尺寸）
│   ├── logo/                    # Logo SVG（亮/暗模式）
│   └── images/                  # 文章配图（按日期子目录）+ 委托图 + 摄影图
│
├── scripts/                     # 构建脚本
│   ├── gen-rss.mjs             # 生成 RSS Feed
│   └── next-sitemap.config.js  # 生成网站地图
│
└── styles/
    └── main.css                 # 全局样式（Tailwind + 自定义 CSS）
```

---

## 三、核心文件详解

### 3.1 配置文件

#### `package.json`
项目的"身份证"。关键信息：
- **脚本命令**：`bun dev`（开发）、`bun run build`（构建）、`bun run prod`（完整构建 = 生成 RSS → 构建 → 生成 Sitemap）
- **核心依赖**：`nextra`（文档引擎）、`nextra-theme-blog`（博客主题）、`gray-matter`（解析 Markdown frontmatter）、`rss`（生成 RSS）
- **注意**：原项目用 Bun，但你也可以改用 npm/pnpm，只需把 `bun run` 换成对应命令

#### `next.config.ts`
Next.js 的"大脑"：
- **Nextra 集成**：将 Nextra 作为插件注入，指定博客主题
- **安全头**：Referrer-Policy、X-Frame-Options、HSTS 等
- **环境分支**：`CF_PAGES === 'true'` 时用静态导出模式（Cloudflare），否则走 Vercel 的动态模式
- **重定向**：旧 URL 自动跳转到新路径
- **Analytics 代理**：`/sight/*` 代理到自建的 Plausible 统计服务

#### `theme.config.tsx`
Nextra 博客主题的"装饰器"：
- **自定义 Head**：引用 `components/custom-head.tsx`，统一注入 SEO 标签
- **日期格式化**：`toDateString()`
- **页脚**：社交媒体图标链接（Twitter、Mastodon、GitHub、Telegram、RSS）
- **版权声明**：CC BY-NC 4.0 + 年份 + 作者名

#### `tailwind.config.ts`
样式系统的配置：
- 自定义颜色（如 `p-light` 正文字色、`back-light` 背景色、暗色模式对应色）
- 自定义字体族（Inter 可变字体 用作 sans、Menlo 用作 mono）
- 自定义断点 `ss`（max: 480px，用于小屏适配）

#### `tsconfig.json`
TypeScript 配置，最重要的是 **路径别名**：
| 别名 | 实际路径 |
|------|----------|
| `#components/*` | `components/*` |
| `#images/*` | `public/images/*` |
| `#commission/*` | `components/commission/*` |
| `#data/*` | `data/*` |

### 3.2 页面文件（`pages/`）

#### `_app.tsx` — 全局入口
- 加载 Inter Display（可变字体）和 Menlo（等宽字体）
- 注入 RSS `<link>` 标签
- 挂载 `CustomAnalytics` 统计组件
- **这是你改全局配置的第一个入口**

#### `_document.tsx` — HTML 骨架
- `<Html lang="en">` — 如果你要改成中文博客，这里要改 `lang="zh-CN"`
- body 上的全局样式类（背景色、抗锯齿、字间距）

#### `index.mdx` — 首页（About 页）
- 用 frontmatter 定义页面元数据
- 内容是纯 Markdown，介绍博主身份
- **改为你自己的个人介绍**

#### `posts.mdx` — 文章列表页
- 引入 `<Posts />` 组件展示所有文章
- Frontmatter 中 `type: posts` 让 Nextra 识别为文章列表

#### `commission.mdx` — 插画委托页
- 展示原博主委托画师创作的二次元插画
- **如果你不需要这个功能，可以整页删除**

#### `photography.md` — 摄影作品索引
- 按年份分组的摄影作品缩略图列表
- **根据需要保留或删除**

#### `pages/posts/*.md` — 博客文章
每篇文章都是 Markdown 文件，包含 frontmatter：

```yaml
---
title: '文章标题'
date: 2020/08/05
description: '文章摘要'
author: Aozaki
image: https://img.aozaki.cc/xxx/cover.jpg
---
```

### 3.3 组件文件（`components/`）

#### `posts.tsx` — 文章列表组件（核心组件）
这是博客最重要的组件之一：
- 使用 Nextra 的 `getPagesUnderRoute('/posts')` 获取所有文章
- 按日期降序排列
- 显示加载状态、错误状态、空状态
- **改博客文章展示逻辑就改这里**

#### `custom-head.tsx` — SEO 头组件
- 动态生成 `<title>`（格式：`文章标题 - 博客名`）
- 注入 Open Graph 标签（社交分享预览）、Twitter Card
- PWA 相关 meta 标签
- **改成你自己的网站名、域名、Twitter 账号**

#### `analytics.tsx` — 统计组件
- 生产环境加载自建 Plausible 统计脚本
- 开发环境不加载
- **替换成你自己的统计服务（或删除）**

#### `open-graph.tsx` — 链接预览卡片
- 在文章内嵌外部链接时，显示带缩略图的美化卡片
- 博客内容的辅助组件

### 3.4 数据文件（`data/`）

这些是原博主个性化的数据，**修改时需要注意**：

| 文件 | 作用 | 是否需要修改 |
|------|------|:--:|
| `types.ts` | 委托数据接口定义 | 保留或删除 |
| `CommissionData.ts` | 汇总所有委托数据 | 可删除 |
| `PhotographyData.ts` | 摄影作品列表 | 可删除 |
| `PriorityList.ts` | 画师优先级 | 可删除 |
| `commission/*.ts` | 具体委托条目 | 可删除 |

### 3.5 脚本文件（`scripts/`）

#### `gen-rss.mjs` — RSS 生成器
- 扫描 `pages/posts/` 下所有 `.md` 文件
- 解析 frontmatter
- 用 `rss` 包生成 `public/feed.xml`
- **改 RSS 标题、域名等信息**

#### `next-sitemap.config.js` — 站点地图生成器
- `bun run post-build` 时调用
- 自动生成 `sitemap.xml`

### 3.6 静态资源（`public/`）

- `fonts/`：Inter 可变字体 + Menlo 等宽字体
- `icons/`：PWA 各尺寸图标（从原博主导出的）
- `logo/`：博客 Logo 的 SVG（亮色/暗色）
- `images/`：所有文章配图、摄影作品、委托图
- `favicon.ico`、`logo.png`：网站图标

---

## 四、数据流与渲染流程

```
用户访问 → Next.js (Pages Router)
           │
           ├─ _document.tsx（HTML 骨架）
           └─ _app.tsx（全局初始化：字体、RSS、统计）
              │
              └─ 具体页面：
                   │
                   ├─ index.mdx → theme.config.tsx 提供布局
                   │
                   ├─ posts.mdx → <Posts /> 组件
                   │     └─ getPagesUnderRoute('/posts') 获取所有文章
                   │     └─ 排序 + 渲染文章列表
                   │
                   ├─ /posts/xxx.md → Nextra 渲染 MDX → 博客文章页
                   │
                   ├─ commission.mdx → <Featured />, <List />, <Stale />
                   │     └─ 从 data/CommissionData.ts 读取数据
                   │
                   └─ photography/*.mdx → <Photo /> 组件
                         └─ 从 data/PhotographyData.ts 读取数据
```

---

## 五、为你定制的修改计划

由于你打算把它改成你自己的博客，以下是按优先级排序的修改建议：

### 🔴 第 1 步：个人信息（必须先改）
| 文件 | 改什么 |
|------|--------|
| `theme.config.tsx` | 页脚链接（GitHub、Twitter 等）、版权名、年份 |
| `pages/index.mdx` | 个人介绍、标题、描述 |
| `components/custom-head.tsx` | 博客名 `Site`、域名 `canonicalUrl`、Twitter 账号 |
| `pages/_document.tsx` | `lang` 属性（中文改 `zh-CN`） |

### 🟡 第 2 步：内容清理（选择性）
| 文件 | 动作 |
|------|------|
| `pages/posts/*.md` | 删除所有旧文章，或保留作为格式参考 |
| `pages/commission.mdx` | 删除（如果你不需要插画委托功能） |
| `pages/photography.md` | 删除或改造成你自己的页面 |
| `pages/photography/*.mdx` | 删除 |
| `data/commission/` | 删除 |
| `data/CommissionData.ts` | 删除 |
| `data/PhotographyData.ts` | 删除 |
| `components/commission/` | 删除 |
| `components/photography/` | 删除 |
| `public/images/` | 删除旧图片，换上你自己的 |

### 🟢 第 3 步：技术配置（按需）
| 文件 | 改什么 |
|------|--------|
| `components/analytics.tsx` | 删除或换成你自己的统计（如 Google Analytics、Umami） |
| `next.config.ts` | 删除原博主的重定向规则 + 统计代理 |
| `scripts/gen-rss.mjs` | 改 RSS 标题、域名 |
| `vercel.json` | 删除或更新部署配置 |
| `wrangler.toml` | 如果不用 Cloudflare Pages，可删除 |
| `package.json` | 改 `name`、`author` |

### 🔵 第 4 步：尝试运行
```powershell
# 安装依赖（首次）
bun install
# 或如果你用 npm：
# npm install

# 启动开发服务器
bun dev
# 浏览器打开 http://localhost:3000
```

---

## 六、关键注意事项

1. **包管理器**：原项目用 Bun，锁文件是 `bun.lockb`。如果你没有 Bun，可以删除 `bun.lockb`，用 `npm install` 重新生成 `package-lock.json`
2. **Node 版本**：`.mise.toml` 要求 Node 22，Next.js 15 也建议 Node 18+
3. **路径别名 `#`**：`tsconfig.json` 中定义了 `#components/*` 等别名，修改文件位置时需要同步更新
4. **Nextra 主题**：博客的布局、导航、暗色模式等由 `nextra-theme-blog` 提供，`theme.config.tsx` 是自定义入口
5. **图片引用**：原博客大量图片托管在 `https://img.aozaki.cc`（外部图床），本地 `public/images/` 只是部分图片

---

## 七、下一步建议

等你确认了方向后，我可以帮你逐一修改。比如：

- "帮我改个人信息"
- "帮我清理掉 commission 和 photography 相关的东西"
- "帮我写第一篇博客文章"
- "帮我把统计换成 Google Analytics"
- "帮我部署到 Vercel"

随时告诉我你想从哪一步开始！
