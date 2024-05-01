import Link from 'next/link'
import './globals.css'
import type { Metadata } from 'next'

import { WordPressPost } from '@/types'

export const metadata: Metadata = {
  title: "The personal blog of Scott Polhemus"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [aboutPage] = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/pages?slug=about`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <html lang="en">
      <body className="flex min-h-[100vh] flex-col">
        <header className="px-4">
          <h1 className="text-2xl font-bold">
            <Link href="/">The personal blog of Scott Polhemus</Link>
          </h1>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          className="bg-gray-800 text-white p-4 rich-text"
          dangerouslySetInnerHTML={{ __html: aboutPage.content.rendered }}
        />
      </body>
    </html>
  )
}
