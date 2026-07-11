# FOLDER_INDEX — app/feed.xml/

## 架构说明

- App Router Route Handler 生成 RSS 2.0
- `dynamic = 'force-static'`，兼容 GitHub Pages 静态导出

## 文件清单

| 文件       | 职责                                      |
| ---------- | ----------------------------------------- |
| `route.ts` | GET `/feed.xml`，从 Velite posts 组装 XML |

## 自指

本文件夹变化时请更新本文件，并同步更新 `PROJECT_INDEX.md`。
