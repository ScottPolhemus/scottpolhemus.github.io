import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import type { Metadata } from 'next'
import { Crimson_Pro, Rubik } from 'next/font/google'
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
      <body className="flex min-h-[100vh] flex-col bg-chardonnay-200">
        <header className="px-4">
          <h1 className="text-2xl font-semibold hover:underline text-golden-bell-900">
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
      </body>
    </html>
  )
}
