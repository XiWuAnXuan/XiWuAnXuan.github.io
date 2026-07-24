/**
 * Input: react
 * Output: TocItem (interface), TableOfContents (default)
 * Pos: UI层-文章左侧可折叠目录与滚动高亮
 *
 * 本注释在文件修改时自动更新
 */

'use client'

import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  depth: number
}

// 目标标题停靠位置距视口顶部的偏移，与 .post-prose 标题 scroll-margin-top(5rem) 一致
const SCROLL_OFFSET = 80
const SCROLL_DURATION_MS = 550

// 模块级记录进行中的动画帧，新的跳转会取消上一段未完成的滚动
let activeScrollFrame = 0

function animateScrollTo(targetY: number) {
  window.cancelAnimationFrame(activeScrollFrame)
  const startY = window.scrollY
  const delta = targetY - startY
  if (Math.abs(delta) < 1) return

  const startTime = performance.now()
  // easeInOutCubic：起步与停靠都柔和
  const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / SCROLL_DURATION_MS)
    window.scrollTo(0, startY + delta * ease(progress))
    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(step)
    }
  }

  activeScrollFrame = window.requestAnimationFrame(step)
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true)
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    if (!items.length) return

    const getHeadings = () =>
      items
        .map(item => document.getElementById(item.id))
        .filter((heading): heading is HTMLElement => Boolean(heading))

    const updateActiveHeading = () => {
      const current = [...getHeadings()]
        .reverse()
        .find(heading => heading.getBoundingClientRect().top <= 140)

      setActiveId(current?.id ?? items[0].id)
    }

    updateActiveHeading()

    // IntersectionObserver 仅在标题穿越视口顶部 140px 触发线时回调，
    // 回调内沿用与原滚动方案完全一致的判定逻辑，避免每帧强制重排。
    const observer = new IntersectionObserver(updateActiveHeading, {
      rootMargin: '-140px 0px 0px 0px',
      threshold: [0, 1],
    })
    getHeadings().forEach(heading => observer.observe(heading))

    window.addEventListener('resize', updateActiveHeading)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [items])

  if (!items.length) return null

  const handleLinkClick = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const heading = document.getElementById(id)
    if (!heading) return // 找不到目标时回退为原生锚点跳转

    event.preventDefault()
    const targetY = heading.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    animateScrollTo(Math.max(0, targetY))
    // 同步地址栏 hash（可复制分享），pushState 不会触发原生跳转
    window.history.pushState(null, '', `#${id}`)
  }

  return (
    <aside
      className={['post-toc', open ? '' : 'post-toc-collapsed'].filter(Boolean).join(' ')}
      aria-label="文章目录"
    >
      <div className="post-toc-header">
        <button
          type="button"
          className="post-toc-collapse-btn"
          aria-expanded={open}
          aria-label={open ? '折叠文章目录' : '展开文章目录'}
          onClick={() => setOpen(value => !value)}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="post-toc-title">文章目录</span>
      </div>
      <nav className="post-toc-nav">
        {items.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleLinkClick(item.id)}
            className={[
              'post-toc-link',
              item.depth === 3 ? 'post-toc-link-nested' : '',
              item.id === activeId ? 'post-toc-link-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
