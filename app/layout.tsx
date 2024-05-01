import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <header className="px-4">
          <h1 className="font-bold text-xl">
            <Link href="/">Next WordPress Blog</Link>
          </h1>
        </header>
        {children}
      </body>
    </html>
  )
}
