# Xuan Blog

Xuan 的个人博客，使用 Next.js 15 App Router、Velite、Tailwind CSS v3.4 和 next-themes 重构。

## 本地运行

要求：

- Node.js 22+
- npm 11+

安装依赖：

`ash
npm install
`

开发预览：

`ash
npm run dev
`

生产构建：

`ash
npm run build
npm run start
`

测试基础工具函数：

`ash
npm test
`

## 内容维护

- 文章放在 content/posts/。
- 文章图片放在 public/images/，frontmatter 或正文中使用 /images/... 引用。
- 文章卡片封面在 frontmatter 添加 image: "/images/example.jpg"。
- 站点图标使用 pp/icon.svg。
- 每次完成可见改动后，记录到 docs/progress-log.md。

## 上传/部署说明

仓库中保留了源码、文章、实际使用的图片、字体和图标；排除了：

-

ode_modules/

- .next/、.velite/、out/ 等构建产物
- 本地预览日志和抓取快照
- 草稿 drafts/
- 已移除旧板块素材 public/images/commission/、public/images/photography/

clone 后运行
pm install && npm run build 即可生成与当前仓库一致的网站。
