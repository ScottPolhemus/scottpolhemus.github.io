import type { Metadata } from 'next'
import { Crimson_Pro, Rubik } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

import './globals.css'
import { WordPressPost } from '@/types'

export const metadata: Metadata = {
  title: 'The personal blog of Scott Polhemus',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [aboutPage] = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/pages?slug=about&ts=1`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <html lang="en" className={`${crimsonPro.variable} ${rubik.variable}`}>
      <body className="bg-chardonnay-200 flex min-h-[100vh] flex-col">
        <header className="px-4">
          <h1 className="text-golden-bell-900 text-2xl font-semibold hover:underline">
            <Link href="/">The personal blog of Scott Polhemus</Link>
          </h1>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-golden-bell-900 p-4 text-white [&_a]:text-white">
          <Image
            alt="Scott Polhemus"
            className="float-right ml-2 h-[100px] w-[100px] rounded-full"
            width="200"
            height="200"
            src="/profile.png"
          />
          <div
            dangerouslySetInnerHTML={{ __html: aboutPage.content.rendered }}
            className="rich-text"
          ></div>
        </footer>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
      </body>
    </html>
  )
}
