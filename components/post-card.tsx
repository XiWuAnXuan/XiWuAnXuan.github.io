/**
 * Input: next/link, lib/reading-stats.mjs
 * Output: PostCardPost (interface), PostCard (default)
 * Pos: UI层-文章卡片（hover虚线、封面、阅读信息）
 *
 * 本注释在文件修改时自动更新
 */

import Link from 'next/link'
import { getReadingStats } from '../lib/reading-stats.mjs'

export interface PostCardPost {
  slug: string
  title: string
  date: string
  description?: string
  image?: string
  content: string
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return formatter.format(date).toUpperCase()
}

export default function PostCard({ post }: { post: PostCardPost }) {
  const readingStats = getReadingStats(post.content)

  return (
    <Link href={`/posts/${post.slug}`} className="post-card group">
      <div className="post-card-front" />
      <div className="post-card-back" />
      <div className="post-card-content">
        <div className="post-card-layout">
          <div className="post-card-copy">
            <h3 className="sm:text-lg mb-3 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {post.title}
            </h3>
            {post.description && (
              <p className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {post.description}
              </p>
            )}
            <div className="date mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <time>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingStats.label}</span>
            </div>
          </div>
          {post.image && (
            <div className="post-card-image-wrap" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" loading="lazy" className="post-card-image" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
