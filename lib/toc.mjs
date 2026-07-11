/**
 * Input: (none)
 * Output: slugifyHeading, getTableOfContents
 * Pos: 工具层-从 Markdown 提取 h2/h3 目录与锚点
 *
 * 本注释在文件修改时自动更新
 */

export function slugifyHeading(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]()#]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getTableOfContents(content) {
  const seen = new Map()
  const headings = []
  let inCodeFence = false

  for (const line of String(content).split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence
      continue
    }

    if (inCodeFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const depth = match[1].length
    const text = match[2].trim()
    const baseId = slugifyHeading(text)
    if (!baseId) continue

    const count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)

    headings.push({
      depth,
      text,
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
    })
  }

  return headings
}
