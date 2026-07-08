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

    const updateActiveHeading = () => {
      const headings = items
        .map(item => document.getElementById(item.id))
        .filter((heading): heading is HTMLElement => Boolean(heading))

      const current = [...headings]
        .reverse()
        .find(heading => heading.getBoundingClientRect().top <= 140)

      setActiveId(current?.id ?? items[0].id)
    }

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
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
