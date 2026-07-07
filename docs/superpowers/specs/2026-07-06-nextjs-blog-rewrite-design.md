# Blog Rewrite Design Spec
**Date:** 2026-07-06  
**Project:** aozaki-next-blog → Xuan's Blog  
**Status:** Approved

---

## 1. Overview

Rewrite the personal blog from Next.js 15 (Pages Router) + Nextra 3 to Next.js 15 (App Router) + Velite. Remove all Nextra dependencies, remove the RSS build script in favor of an in-app RSS route, and preserve the existing Tailwind CSS v3.4 configuration. Retain dual deployment support for Vercel and Cloudflare Pages.

---

## 2. Goals

- Replace Nextra (theme engine, layout, content API) with a clean App Router setup
- Use Velite as the content layer for type-safe MDX/MD processing at build time
- Support both `.md` and `.mdx` post formats
- Implement RSS feed as `app/feed.xml/route.ts` using Velite-generated data (no external scripts)
- Retain Tailwind CSS v3.4 with existing `tailwind.config.ts`
- Add dark mode: system default + manual toggle via `next-themes`
- Deploy to both Vercel (dynamic) and Cloudflare Pages (static export) via environment branch in `next.config.ts`

## 3. Non-Goals

- No photography page
- No commission page
- No RSS build script (`scripts/gen-rss.mjs` removed)
- No Tailwind CSS v4 upgrade (deferred)
- No CMS or database integration

---

## 4. Tech Stack

| Dimension | Choice | Notes |
|-----------|--------|-------|
| Framework | Next.js 15 (App Router) | Replaces Pages Router |
| Content layer | Velite | Replaces Nextra content API and `gray-matter` |
| Styling | Tailwind CSS v3.4 | Existing `tailwind.config.ts` retained |
| Dark mode | `next-themes` | System auto + manual toggle |
| RSS | `app/feed.xml/route.ts` | Built from Velite data, no `rss` package |
| Deployment | Vercel + Cloudflare Pages | Environment branch in `next.config.ts` |

### Removed dependencies
- `nextra`
- `nextra-theme-blog`
- `gray-matter`
- `rss`
- `next-sitemap` (optional, re-add later if needed)

---

## 5. Directory Structure

```
Blog_Project/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, ThemeProvider, nav, footer
│   ├── page.tsx                    # Home / About page (replaces pages/index.mdx)
│   ├── posts/
│   │   ├── page.tsx                # Post list page
│   │   └── [slug]/
│   │       └── page.tsx            # Post detail page (MDX render)
│   ├── feed.xml/
│   │   └── route.ts                # RSS feed route (XML response)
│   └── globals.css                 # Global styles (Tailwind directives + custom CSS)
│
├── components/
│   ├── theme-toggle.tsx            # Dark mode toggle button
│   ├── post-list.tsx               # Post list component (replaces components/posts.tsx)
│   └── mdx-components.tsx         # MDX component mapping + Nextra legacy fallbacks
│
├── content/
│   └── posts/                      # All posts (.md / .mdx)
│       └── *.md / *.mdx
│
├── public/                         # Static assets (fonts, icons, images — unchanged)
│
├── velite.config.ts                # Velite collection schema
├── next.config.ts                  # withVelite plugin + transpilePackages + deploy branch
├── tailwind.config.ts              # Existing Tailwind config (retained)
├── tsconfig.json                   # Update path aliases, add .velite output alias
└── package.json                    # Updated dependencies
```

---

## 6. Velite Configuration

### Schema (`velite.config.ts`)

```ts
import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.{md,mdx}',
  schema: s
    .object({
      title: s.string(),
      date: s.string(),
      description: s.string().optional(),
      author: s.string().optional(),
      slug: s.string().optional(),   // optional manual override
    })
    .transform((data, ctx) => ({
      ...data,
      // slug: prefer frontmatter override, fallback to filename without extension
      slug: data.slug ?? ctx.meta.basename,
    })),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
  },
  collections: { posts },
})
```

### Slug resolution rules

1. If `slug` is present in frontmatter → use that value
2. Otherwise → use `ctx.meta.basename` (filename without extension)

This allows permanent link overrides without renaming files.

---

## 7. next.config.ts Requirements

```ts
import { withVelite } from 'velite/next'

const nextConfig = withVelite({
  transpilePackages: ['velite'],
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
    minimumCacheTTL: 604800,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(process.env.CF_PAGES === 'true'
    ? { output: 'export' }
    : {
        async headers() { /* security headers */ },
        async redirects() { /* legacy redirects */ },
      }),
})

export default nextConfig
```

`withVelite` must wrap the entire config object. `transpilePackages: ['velite']` is required to avoid module resolution errors in the App Router.

---

## 8. RSS Feed Route

**File:** `app/feed.xml/route.ts`

- Import `posts` from `@/.velite` (generated at build time)
- Sort posts by date descending
- Build a valid RSS 2.0 XML string manually (no external `rss` package)
- Return `new Response(xml, { headers: { 'Content-Type': 'application/xml' } })`
- Site URL and feed metadata (title, description, author) hardcoded to Xuan's blog values

---

## 9. MDX Component Mapping

**File:** `components/mdx-components.tsx`

Provides two kinds of mappings:

1. **Standard HTML overrides** — custom styling for `h1`, `h2`, `a`, `code`, `pre`, `img`, etc.
2. **Nextra legacy fallbacks** — prevents build errors from any remaining Nextra-specific JSX in old posts:

```ts
// Legacy Nextra components → safe no-op wrappers
const Callout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const Tabs = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const Tab = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const Steps = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const FileTree = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
```

These wrappers preserve content without throwing, so old posts degrade gracefully.

---

## 10. Dark Mode

- Package: `next-themes`
- `ThemeProvider` wraps the root layout with `attribute="class"` and `defaultTheme="system"`
- `tailwind.config.ts` sets `darkMode: 'class'`
- All color tokens use `dark:` Tailwind variants
- `theme-toggle.tsx` cycles between `light`, `dark`, and `system`; placed in the site header

---

## 11. Page Specifications

### `app/layout.tsx`
- Load Inter Display (variable font) and Menlo (monospace) via `next/font/local`
- Wrap with `ThemeProvider`
- Render site header (title link + theme toggle) and footer (social links + copyright)
- Inject RSS `<link>` tag

### `app/page.tsx`
- Static About/Home content (replaces `pages/index.mdx`)
- Plain JSX, no MDX dependency

### `app/posts/page.tsx`
- Import `posts` from `@/.velite`
- Sort by `date` descending
- Render via `<PostList posts={posts} />`

### `app/posts/[slug]/page.tsx`
- Find post by `slug` from Velite data
- Render MDX content using `next-mdx-remote` or Velite's built-in MDX output
- Pass `mdx-components.tsx` as component mapping
- Generate static params via `generateStaticParams`
- Generate metadata via `generateMetadata` (title, description, OG tags)

---

## 12. Data Flow

```
content/posts/*.md|mdx
        │
        ▼
  Velite (build time)
        │
        ▼
  .velite/ (type-safe JSON + TS types)
        │
   ┌────┴────────────────┐
   ▼                     ▼                    ▼
posts/page.tsx    posts/[slug]/page.tsx   feed.xml/route.ts
   │                     │
   ▼                     ▼
PostList component    MDX render
                    + mdx-components.tsx
```

---

## 13. tsconfig.json Updates

Add path alias for Velite output:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "#components/*": ["components/*"],
      "#data/*": ["data/*"]
    }
  }
}
```

The `.velite` output is imported as `@/.velite` (covered by `@/*` alias).

---

## 14. Migration Notes

- Move `pages/posts/*.md` and `pages/posts/*.mdx` → `content/posts/`
- Delete `pages/`, `data/commission/`, `data/CommissionData.ts`, `data/PhotographyData.ts`, `data/PriorityList.ts`, `components/commission/`, `components/photography/`, `components/open-graph.tsx`, `scripts/`
- Keep `public/` (fonts, icons, images) unchanged
- Keep `tailwind.config.ts`, `postcss.config.mjs`, `.prettierrc.js`, `eslint.config.mjs`, `.husky/` unchanged
- Update `theme.config.tsx` → deleted (Nextra only); footer and head logic moves into `app/layout.tsx` and `components/`

---

## 15. Open Questions

None. All decisions are locked.
