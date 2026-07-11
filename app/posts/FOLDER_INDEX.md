# FOLDER_INDEX — app/posts/

## 架构说明

- 博客文章路由组：列表第 1 页、分页、详情
- 列表依赖 `lib/pagination.mjs`；详情依赖 MDX + TOC + 阅读统计

## 文件清单

| 文件       | 职责                 |
| ---------- | -------------------- |
| `page.tsx` | `/posts` 第 1 页列表 |

## 子目录

| 目录      | 说明                     |
| --------- | ------------------------ |
| `[slug]/` | 文章详情 `/posts/:slug`  |
| `page/`   | 分页 `/posts/page/:page` |

## 自指

本文件夹变化时请更新本文件，并同步更新 `PROJECT_INDEX.md`。
