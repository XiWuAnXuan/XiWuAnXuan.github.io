/**
 * Input: @/.velite
 * Output: dynamic=force-static, GET (RSS XML Response)
 * Pos: 路由层-RSS Feed，静态导出 /feed.xml
 *
 * 本注释在文件修改时自动更新
 */

import { posts } from '@/.velite'

export const dynamic = 'force-static'

const SITE_URL = 'https://XiWuAnXuan.github.io'
const SITE_TITLE = "Xuan's blog"
const SITE_DESCRIPTION = "Xuan's blog, writing to record my life and hobbies."

export async function GET() {
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const items = sortedPosts
    .map(
      post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description ?? ''}]]></description>
      <author>${post.author ?? 'Xuan'}</author>
    </item>`,
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
