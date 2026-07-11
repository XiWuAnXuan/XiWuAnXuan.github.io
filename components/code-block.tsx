/**
 * Input: react, shiki
 * Output: CodeBlock (default)
 * Pos: UI层-MDX代码块，语法高亮 + 语言标签 + 一键复制
 *
 * 本注释在文件修改时自动更新
 */

'use client'

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { codeToHtml } from 'shiki'

/** Map common fence labels to shiki language ids */
const LANGUAGE_ALIASES: Record<string, string> = {
  conf: 'ini',
  config: 'ini',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  tsx: 'tsx',
  jsx: 'jsx',
  plaintext: 'text',
  txt: 'text',
  text: 'text',
  console: 'bash',
  dockerfile: 'docker',
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return ''
}

function parseCodeChild(children: ReactNode): { language: string; code: string } {
  const child = Children.toArray(children).find(isValidElement) as
    React.ReactElement<{ className?: string; children?: ReactNode }> | undefined

  const className = child?.props?.className ?? ''
  const match = /language-([\w#+-]+)/.exec(className)
  const rawLang = (match?.[1] ?? 'text').toLowerCase()
  const language = LANGUAGE_ALIASES[rawLang] ?? rawLang
  const code = extractText(child?.props?.children ?? children).replace(/\n$/, '')

  return { language, code }
}

async function highlight(code: string, language: string): Promise<string> {
  const options = {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false as const,
  }

  try {
    return await codeToHtml(code, { ...options, lang: language })
  } catch {
    return codeToHtml(code, { ...options, lang: 'text' })
  }
}

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const { language, code } = useMemo(() => parseCodeChild(children), [children])
  const displayLang = language === 'text' ? 'text' : language
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setHtml(null)

    highlight(code, language).then(result => {
      if (!cancelled) setHtml(result)
    })

    return () => {
      cancelled = true
    }
  }, [code, language])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }, [code])

  return (
    <div className="code-block not-prose">
      <div className="code-block-toolbar">
        <span className="code-block-lang" title={displayLang}>
          {displayLang}
        </span>
        <button
          type="button"
          className="code-block-copy"
          onClick={handleCopy}
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      {html ? (
        <div className="code-block-body" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="code-block-fallback">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
