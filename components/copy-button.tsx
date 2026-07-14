/**
 * Input: react
 * Output: CopyButton (default)
 * Pos: UI层-代码块复制按钮（仅此交互需客户端）
 *
 * 本注释在文件修改时自动更新
 */

'use client'

import { useCallback, useState } from 'react'

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

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
    <button
      type="button"
      className="code-block-copy"
      onClick={handleCopy}
      aria-label={copied ? '已复制' : '复制代码'}
    >
      {copied ? '已复制' : '复制'}
    </button>
  )
}
