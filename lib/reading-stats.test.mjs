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

  // 标题(2) + 这是一段中文内容(8) + English/words/are/counted/too(5) = 15
  assert.equal(stats.wordCount, 15)
  assert.equal(stats.cjkCount, 10)
  assert.equal(stats.latinWordCount, 5)
  assert.equal(stats.readingMinutes, 1)
  assert.equal(stats.label, '约 1 分钟阅读 · 15 字')
})

test('rounds reading time up by CJK word count', () => {
  const content = Array.from({ length: 401 }, () => '字').join('')
  const stats = getReadingStats(content)

  assert.equal(stats.wordCount, 401)
  assert.equal(stats.readingMinutes, 2)
})

test('markdown links keep label text and do not swallow following prose', () => {
  const stats = getReadingStats(`
After posting [the previous article](./kanaut-nishe-merch) on my blog, one of my friends sent me a message.

Above is the fine art print produced at the end of 2020 to celebrate the launch of the light novel "[異世界迷宮の最深部を目指そう](https://www.amazon.co.jp/dp/4865548254)" Vol.15.
`)

  // Must count the long English sentence after the link, not only the first clause
  // (regression: bare-URL strip used to eat `)` and make link regex swallow the rest)
  assert.ok(stats.latinWordCount >= 35, `latinWordCount too low: ${stats.latinWordCount}`)
  // Japanese title chars preserved from link label
  assert.ok(stats.cjkCount >= 10, `cjkCount too low: ${stats.cjkCount}`)
  assert.ok(stats.wordCount >= 45, `wordCount too low: ${stats.wordCount}`)
})

test('images and bare urls are excluded from word count', () => {
  const stats = getReadingStats(`
Hello world

![photo](/images/20221217/0001.jpg)

See https://example.com/path/to/page for more.
`)

  // Hello world See for more — URL path not counted
  assert.equal(stats.latinWordCount, 5)
  assert.equal(stats.wordCount, 5)
})

test('english-heavy article is not undercounted to a few hundred units when thousands of chars', () => {
  const words = Array.from({ length: 500 }, (_, i) => `word${i}`).join(' ')
  const stats = getReadingStats(words)
  assert.equal(stats.latinWordCount, 500)
  assert.equal(stats.wordCount, 500)
  // 500 / 230 ≈ 2.17 → 3 minutes
  assert.equal(stats.readingMinutes, 3)
})
