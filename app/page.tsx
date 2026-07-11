/**
 * Input: next/link, @/.velite, #components/post-card
 * Output: metadata, HomePage (default)
 * Pos: 路由层-关于页首页，展示简介与最近文章
 *
 * 本注释在文件修改时自动更新
 */

import Link from 'next/link'
import { posts } from '@/.velite'
import PostCard from '#components/post-card'

export const metadata = {
  title: 'About',
  description: "Xuan's blog, writing to record my life and hobbies.",
}

export default function HomePage() {
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-16">
      <section className="flex items-start gap-6 ss:flex-col">
        <img
          src="/icon.svg"
          alt="Xuan"
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
        />
        <div className="pt-1">
          <h1 className="mb-3 text-3xl font-semibold tracking-[-0.02em] text-zinc-950 dark:text-zinc-50">
            Xuan
          </h1>
          <p className="mb-2 text-p-light dark:text-gray-300">Doctor / Cardiologist / MD</p>
          <p className="mb-5 text-p-light dark:text-gray-300">
            Photographer / Audiophile / Cinephile
          </p>
          <p className="max-w-xl leading-7 text-zinc-600 dark:text-zinc-400">
            Read, observe, write. It forges my soul. I write about life, work, reading, movies, and
            small fragments worth keeping.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">最近文章</h2>
          <Link href="/posts" className="text-sm text-zinc-500 !no-underline dark:text-zinc-400">
            查看全部
          </Link>
        </div>
        <div className="space-y-7">
          {recentPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 ss:grid-cols-1">
        <Link
          href="/feed.xml"
          className="rounded-lg border border-zinc-200 p-5 !no-underline dark:border-zinc-800"
        >
          <h2 className="mb-2 text-base font-semibold text-zinc-950 dark:text-zinc-50">订阅</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">通过 RSS 关注最新文章。</p>
        </Link>
        <Link
          href="/posts"
          className="rounded-lg border border-zinc-200 p-5 !no-underline dark:border-zinc-800"
        >
          <h2 className="mb-2 text-base font-semibold text-zinc-950 dark:text-zinc-50">归档</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">阅读所有博客文章。</p>
        </Link>
      </section>
    </div>
  )
}
