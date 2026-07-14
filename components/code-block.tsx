/**
 * Input: react, shiki, #components/copy-button
 * Output: CodeBlock (default)
 * Pos: UI层-MDX代码块，构建期语法高亮 + 语言标签 + 一键复制
 *
 * 本注释在文件修改时自动更新
 */

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { codeToHtml } from 'shiki'
import CopyButton from '#components/copy-button'

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
    ReactElement<{ className?: string; children?: ReactNode }> | undefined

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

export default async function CodeBlock({ children }: { children?: ReactNode }) {
  const { language, code } = parseCodeChild(children)
  const html = await highlight(code, language)

  return (
    <div className="code-block not-prose">
      <div className="code-block-toolbar">
        <span className="code-block-lang" title={language}>
          {language}
        </span>
        <CopyButton code={code} />
      </div>
      <div className="code-block-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
