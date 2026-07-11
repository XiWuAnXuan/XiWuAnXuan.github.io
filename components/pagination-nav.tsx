/**
 * Input: next/link
 * Output: PaginationNav (default)
 * Pos: UI层-文章列表分页导航
 *
 * 本注释在文件修改时自动更新
 */

import Link from 'next/link'

const getPageHref = (page: number) => (page === 1 ? '/posts' : `/posts/page/${page}`)

export default function PaginationNav({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const previousPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null

  return (
    <nav
      aria-label="Posts pagination"
      className="mt-10 flex items-center justify-between gap-4 font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400"
    >
      {previousPage ? (
        <Link
          href={getPageHref(previousPage)}
          className="!no-underline hover:text-neutral-900 dark:hover:text-white"
        >
          ← 上一页
        </Link>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
          <Link
            key={page}
            href={getPageHref(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex size-8 items-center justify-center rounded-full !no-underline ${
              page === currentPage
                ? 'bg-neutral-900 text-white hover:!opacity-100 dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>
      {nextPage ? (
        <Link
          href={getPageHref(nextPage)}
          className="!no-underline hover:text-neutral-900 dark:hover:text-white"
        >
          下一页 →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
