import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { slugifyHeading } from '../lib/toc.mjs'

const getHeadingText = (children: React.ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(getHeadingText).join('')
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return getHeadingText((children as { props?: { children?: React.ReactNode } }).props?.children)
  }

  return ''
}

const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  a: ({ href, children }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      )
    }
    return <Link href={href ?? '#'}>{children}</Link>
  },
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ''} loading="lazy" />
  ),
  pre: ({ children }) => <pre>{children}</pre>,
  code: ({ children }) => <code>{children}</code>,

  // Nextra legacy fallbacks
  Callout: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      {children}
    </div>
  ),
  Tabs: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Tab: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Steps: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  FileTree: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}

export function createMdxComponents(): MDXComponents {
  const headingCounts = new Map<string, number>()

  const getHeadingId = (children: React.ReactNode) => {
    const baseId = slugifyHeading(getHeadingText(children))
    const count = headingCounts.get(baseId) ?? 0
    headingCounts.set(baseId, count + 1)
    return count === 0 ? baseId : `${baseId}-${count + 1}`
  }

  return {
    ...mdxComponents,
    h2: ({ children }) => <h2 id={getHeadingId(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={getHeadingId(children)}>{children}</h3>,
  }
}

export default mdxComponents
