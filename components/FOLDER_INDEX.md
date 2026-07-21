# FOLDER_INDEX — components/

## 架构说明

- UI 组件层：博客界面可复用部件
- 被 `app/` 路由页面与根布局引用
- 依赖 `lib/` 工具（阅读统计、TOC slug）与 next/react 生态

## 文件清单

| 文件                    | 职责                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `code-block.tsx`        | 代码块语法高亮（Shiki）+ 语言标签 + 一键复制                 |
| `decorative-grid.tsx`   | 顶部两侧装饰虚线网格                                         |
| `mdx-components.tsx`    | MDX 组件映射 + 标题锚点 + 代码块 + Nextra 兜底               |
| `pagination-nav.tsx`    | 文章列表分页导航                                             |
| `post-card.tsx`         | 单篇文章卡片（封面、阅读信息、hover）                        |
| `post-list.tsx`         | 文章卡片列表容器                                             |
| `site-header.tsx`       | 顶部导航（滚动收缩、毛玻璃、天气挂件）                       |
| `table-of-contents.tsx` | 文章左侧可折叠目录                                           |
| `theme-toggle.tsx`      | 亮/暗主题切换                                                |
| `weather-widget.tsx`    | 页眉天气挂件（IP 定位 + Open-Meteo，缓存 30 分钟，失败静默） |

## 自指

本文件夹变化时请更新本文件，并同步更新 `PROJECT_INDEX.md`。
