const DEFAULT_CHARS_PER_MINUTE = 400;

const stripNonReadingText = (content) =>
  content
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/^import\s.+$/gm, " ")
    .replace(/^export\s.+$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_~|[\]{}()\\-]/g, " ");

export function getReadingStats(content, charsPerMinute = DEFAULT_CHARS_PER_MINUTE) {
  const readableText = stripNonReadingText(content);
  const cjkCount =
    readableText.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g)?.length ??
    0;
  const latinWordCount =
    readableText.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  const wordCount = cjkCount + latinWordCount;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / charsPerMinute));

  return {
    wordCount,
    readingMinutes,
    label: `约 ${readingMinutes} 分钟阅读 · ${wordCount.toLocaleString("zh-CN")} 字`,
  };
}
