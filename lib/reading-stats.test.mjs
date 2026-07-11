/**
 * Input: node:assert/strict, node:test, ./reading-stats.mjs
 * Output: Node test suite for reading stats
 * Pos: 测试层-阅读统计单测
 *
 * 本注释在文件修改时自动更新
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getReadingStats } from './reading-stats.mjs'

test('counts readable content and estimates at least one minute', () => {
  const stats = getReadingStats(`
---
title: Example
---

# 标题

这是一段中文内容。

\`\`\`ts
const ignored = "代码不计入";
\`\`\`

English words are counted too.
`)

  assert.equal(stats.wordCount, 15)
  assert.equal(stats.readingMinutes, 1)
  assert.equal(stats.label, '约 1 分钟阅读 · 15 字')
})

test('rounds reading time up by word count', () => {
  const content = Array.from({ length: 401 }, () => '字').join('')
  const stats = getReadingStats(content)

  assert.equal(stats.wordCount, 401)
  assert.equal(stats.readingMinutes, 2)
})
