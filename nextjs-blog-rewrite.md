# Blog Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Rewrite the personal blog from Next.js 15 Pages Router + Nextra 3 to Next.js 15 App Router + Velite, with Tailwind CSS v3.4, next-themes dark mode, and an in-app RSS route.

**Architecture:** Velite processes content/posts at build time and outputs type-safe data to .velite/. App Router pages import that data directly. The RSS feed is served from app/feed.xml/route.ts using the same Velite data, with no external scripts.

**Tech Stack:** Next.js 15 (App Router), Velite, TypeScript, Tailwind CSS v3.4, next-themes, next-mdx-remote

---

## File Map

### Created

- - Velite collection schema and slug transform
- - Root layout: fonts, ThemeProvider, header, footer
- - Global styles migrated from styles/main.css
- - Home/About page
- - Post list page
- - Post detail page with MDX render
- - RSS 2.0 feed route
- - Dark mode toggle button
- - Post list component
- - MDX component mapping + Nextra fallbacks
- - Migrated posts from pages/posts/

### Modified

- - Replace Nextra with withVelite, add transpilePackages
- - Add darkMode: class, update content paths
- - Update paths, add .velite include
- - Remove Nextra/rss/gray-matter, add Velite/next-themes/next-mdx-remote

### Deleted

- - Entire directory
- - Entire directory
- - Entire directory
- , , ,
- - Entire directory
- - Entire directory
-
-

---
