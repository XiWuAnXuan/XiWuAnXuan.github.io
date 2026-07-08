import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import localFont from 'next/font/local'
import Link from 'next/link'
import { FaGithub, FaMastodon, FaRss, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import DecorativeGrid from '#components/decorative-grid'
import SiteHeader from '#components/site-header'
import './globals.css'

const inter = localFont({
  variable: '--font-inter',
  display: 'block',
  style: 'normal',
  src: [
    {
      path: '../public/fonts/InterDisplay-roman.var.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/InterDisplay-roman.var.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
})

const ioskeleyMono = localFont({
  variable: '--font-ioskeley-mono',
  display: 'block',
  src: [
    {
      path: '../public/fonts/ioskeley/IoskeleyMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ioskeley/IoskeleyMono-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/ioskeley/IoskeleyMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ioskeley/IoskeleyMono-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/ioskeley/IoskeleyMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: {
    default: "Xuan's blog",
    template: "%s - Xuan's blog",
  },
  description: "Xuan's blog, writing to record my life and hobbies.",
  authors: [{ name: 'Xuan' }],
  metadataBase: new URL('https://XiWuAnXuan.github.io'),
  openGraph: {
    siteName: "Xuan's blog",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xuan__',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#6fa8dc" />
      </head>
      <body
        className={`${inter.variable} ${ioskeleyMono.variable} bg-back-light font-sans tracking-custom antialiased selection:bg-selected dark:bg-back-dark ss:min-h-dynamic`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DecorativeGrid />
          <SiteHeader />
          <div className="relative z-10 mx-auto max-w-[40rem] px-6 pb-12 ss:px-4 ss:pb-8">
            <main>{children}</main>
            <footer>
              <hr className="my-8 dark:!border-[#292c2d]" />
              <div className="grid auto-cols-min grid-flow-col gap-8 text-xl ss:gap-4">
                <Link
                  href="https://twitter.com/Xuan__"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </Link>
                <Link
                  href="https://m.cmx.im/@aozaki"
                  target="_blank"
                  rel="me"
                  aria-label="Mastodon"
                >
                  <FaMastodon />
                </Link>
                <Link
                  href="https://github.com/aozaki-kuro"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </Link>
                <Link
                  href="https://t.me/aozaki_ch"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                >
                  <FaTelegramPlane />
                </Link>
                <Link href="/feed.xml" target="_blank" rel="noreferrer" aria-label="RSS">
                  <FaRss />
                </Link>
              </div>
              <small className="mt-32 block text-p-light dark:text-inherit">
                <abbr
                  title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                  className="cursor-help"
                >
                  CC BY-NC 4.0
                </abbr>{' '}
                <time>{year}</time> © Xuan.
                <span className="float-right">[ Afezria ]</span>
              </small>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
