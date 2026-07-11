/**
 * Input: (none)
 * Output: getReadingStats(content, charsPerMinute?)
 * Pos: 工具层-字数与阅读时间估算
 *
 * 本注释在文件修改时自动更新
 */

/** CJK 阅读速度（字/分钟） */
const DEFAULT_CJK_PER_MINUTE = 400
/** 英文阅读速度（词/分钟） */
const DEFAULT_LATIN_WORDS_PER_MINUTE = 230

/**
 * Strip markdown/MDX chrome; keep readable prose.
 * Order matters: links before bare URLs, so `)` of `[text](url)` is not eaten.
 */
const stripNonReadingText = content =>
  String(content ?? '')
    // frontmatter
    .replace(/^---[\s\S]*?---/m, ' ')
    // fenced code
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code
    .replace(/`[^`]*`/g, ' ')
    // MDX imports/exports
    .replace(/^import\s.+$/gm, ' ')
    .replace(/^export\s.+$/gm, ' ')
    // HTML tags
    .replace(/<\/?[^>]+>/g, ' ')
    // images (drop alt + path; not body prose)
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    // markdown links → keep label only (before bare-URL strip)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // bare URLs (do not consume trailing `)` / `]` from md remnants)
    .replace(/https?:\/\/[^\s)<\]]+/g, ' ')
    // heading markers at line start
    .replace(/^#{1,6}\s+/gm, ' ')
    // bold / italic / strike wrappers (best-effort)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // leftover md punctuation (keep hyphen/apostrophe for words like COVID-19 / Nishe's)
    .replace(/[#>*\[\]{}()|\\~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * @param {string} content markdown / mdx source
 * @param {{ cjkPerMinute?: number, latinWordsPerMinute?: number }} [options]
 */
export function getReadingStats(content, options = {}) {
  // Backward-compatible: second arg used to be charsPerMinute number
  const opts =
    typeof options === 'number' ? { cjkPerMinute: options, latinWordsPerMinute: options } : options

  const cjkPerMinute = opts.cjkPerMinute ?? DEFAULT_CJK_PER_MINUTE
  const latinWordsPerMinute = opts.latinWordsPerMinute ?? DEFAULT_LATIN_WORDS_PER_MINUTE

  const readableText = stripNonReadingText(content)

  // CJK ideographs + kana (each char = 1 unit for Chinese "字")
  const cjkCount = readableText.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0

  // Latin / digit tokens as words (English "word")
  const latinWordCount = readableText.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0

  // Display unit: CJK 字 + English 词（中文界面统一称「字」作计量单位）
  const wordCount = cjkCount + latinWordCount

  const readingMinutes = Math.max(
    1,
    Math.ceil(cjkCount / cjkPerMinute + latinWordCount / latinWordsPerMinute),
  )

  return {
    wordCount,
    cjkCount,
    latinWordCount,
    readingMinutes,
    label: `约 ${readingMinutes} 分钟阅读 · ${wordCount.toLocaleString('zh-CN')} 字`,
  }
}
