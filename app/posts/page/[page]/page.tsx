/**
 * Input: next/navigation, @/.velite, #components/pagination-nav, #components/post-list, lib/pagination.mjs
 * Output: generateStaticParams, generateMetadata, PostsPaginatedPage (default)
 * Pos: 路由层-文章列表分页页 (/posts/page/N)
 *
 * 本注释在文件修改时自动更新
 */

import { notFound } from 'next/navigation'
import { posts } from '@/.velite'
import PaginationNav from '#components/pagination-nav'
import PostList from '#components/post-list'
import {
  getPageNumbers,
  getPaginatedItems,
  getTotalPages,
  POSTS_PER_PAGE,
} from '../../../../lib/pagination.mjs'

interface Params {
  page: string
}

const sortedPosts = [...posts].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
})

export function generateStaticParams(): Params[] {
  return getPageNumbers(sortedPosts.length, POSTS_PER_PAGE)
    .filter(page => page > 1)
    .map(page => ({ page: String(page) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { page } = await params
  return {
    title: `Posts - Page ${page}`,
    description: `Blog posts page ${page}.`,
  }
}

export default async function PostsPaginatedPage({ params }: { params: Promise<Params> }) {
  const { page } = await params
  const currentPage = Number(page)
  const totalPages = getTotalPages(sortedPosts.length, POSTS_PER_PAGE)

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > totalPages) {
    notFound()
  }

  const currentPosts = getPaginatedItems(sortedPosts, currentPage, POSTS_PER_PAGE)

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        博客
      </h1>
      <PostList posts={currentPosts} />
      <PaginationNav currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
