'use client'

import { useState } from 'react'

export interface TocItem {
  id: string
  text: string
  depth: number
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true)

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
              className={item.depth === 3 ? 'post-toc-link post-toc-link-nested' : 'post-toc-link'}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </aside>
  )
}
