import type { Metadata } from 'next'
import { Crimson_Pro, Rubik } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Markdown from 'react-markdown'

import { BlogClient } from '@/services/blog'
import '../globals.css'

export const metadata: Metadata = {
  title: 'The personal blog of Scott Polhemus',
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: `${process.env.NEXT_PUBLIC_APP_HOST}/rss.xml`,
        },
      ],
    },
  },
}

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-pro',
})

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
})

const blog = new BlogClient()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const aboutContent = await blog.findContent({ slug: 'about' })

  return (
    <html lang="en" className={`${crimsonPro.variable} ${rubik.variable}`}>
      <body className="flex min-h-[100vh] flex-col bg-chardonnay-200">
        <header className="px-4 pt-2">
          <h1 className="mx-auto max-w-7xl text-2xl font-semibold text-golden-bell-900 hover:underline">
            <Link href="/">The personal blog of Scott Polhemus</Link>
          </h1>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-golden-bell-900 p-4 text-white [&_a]:text-white">
          <div className="mx-auto max-w-7xl">
            <Image
              alt="Scott Polhemus"
              className="float-right ml-2 h-[100px] w-[100px] rounded-full"
              width="200"
              height="200"
              src="/profile.png"
            />
            {!!aboutContent && (
              <div className="rich-text">
                <Markdown>{aboutContent.value.content}</Markdown>
              </div>
            )}
          </div>
        </footer>
        {!!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
          </Script>
        )}
      </body>
    </html>
  )
}
