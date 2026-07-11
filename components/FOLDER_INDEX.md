# FOLDER_INDEX — components/

## 架构说明

- UI 组件层：博客界面可复用部件
- 被 `app/` 路由页面与根布局引用
- 依赖 `lib/` 工具（阅读统计、TOC slug）与 next/react 生态

## 文件清单

| 文件                    | 职责                                      |
| ----------------------- | ----------------------------------------- |
| `decorative-grid.tsx`   | 顶部两侧装饰虚线网格                      |
| `mdx-components.tsx`    | MDX 组件映射 + 标题锚点 + Nextra 兼容兜底 |
| `pagination-nav.tsx`    | 文章列表分页导航                          |
| `post-card.tsx`         | 单篇文章卡片（封面、阅读信息、hover）     |
| `post-list.tsx`         | 文章卡片列表容器                          |
| `site-header.tsx`       | 顶部导航（滚动收缩、毛玻璃）              |
| `table-of-contents.tsx` | 文章左侧可折叠目录                        |
| `theme-toggle.tsx`      | 亮/暗主题切换                             |

## 自指

本文件夹变化时请更新本文件，并同步更新 `PROJECT_INDEX.md`。
