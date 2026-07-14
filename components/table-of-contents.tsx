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

  return (
    <aside className="post-toc" aria-label="文章目录">
      <button
        type="button"
        className="post-toc-toggle"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span>目录</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <nav className="post-toc-nav">
          {items.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
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
      )}
    </aside>
  )
}
