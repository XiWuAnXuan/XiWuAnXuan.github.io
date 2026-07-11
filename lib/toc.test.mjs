/**
 * Input: node:assert/strict, node:test, ./toc.mjs
 * Output: Node test suite for TOC helpers
 * Pos: 测试层-目录工具单测
 *
 * 本注释在文件修改时自动更新
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import { getTableOfContents, slugifyHeading } from './toc.mjs'

test('creates stable slugs from heading text', () => {
  assert.equal(slugifyHeading('Hello, World!'), 'hello-world')
  assert.equal(slugifyHeading('中文标题'), '中文标题')
  assert.equal(slugifyHeading('React & MDX: Notes'), 'react-mdx-notes')
})

test('extracts h2 and h3 headings while ignoring code fences', () => {
  const content = [
    '# Page title',
    '',
    '## First Section',
    '### Details',
    '```md',
    '## Not a Heading',
    '```',
    '#### Too deep',
    '## First Section',
  ].join('\n')

  assert.deepEqual(getTableOfContents(content), [
    { depth: 2, text: 'First Section', id: 'first-section' },
    { depth: 3, text: 'Details', id: 'details' },
    { depth: 2, text: 'First Section', id: 'first-section-2' },
  ])
})
