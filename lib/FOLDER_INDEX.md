# FOLDER_INDEX — lib/

## 架构说明

- 纯工具层：无 React 依赖，供页面与组件复用
- 分页 / 阅读统计 / Markdown 目录解析
- 配套 `node:test` 单测（`*.test.mjs`）

## 文件清单

| 文件                     | 职责                             |
| ------------------------ | -------------------------------- |
| `pagination.mjs`         | 每页条数、总页数、切片、页码列表 |
| `pagination.test.mjs`    | 分页工具单测                     |
| `reading-stats.mjs`      | 字数与预计阅读时间               |
| `reading-stats.test.mjs` | 阅读统计单测                     |
| `toc.mjs`                | 标题 slug 与 h2/h3 目录提取      |
| `toc.test.mjs`           | TOC 工具单测                     |

## 自指

本文件夹变化时请更新本文件，并同步更新 `PROJECT_INDEX.md`。
