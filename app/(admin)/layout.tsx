import Link from 'next/link'
import { Crimson_Pro, Rubik } from 'next/font/google'

import AdminProvider from '@/components/admin/ClientProvider'
import '../globals.css'

export const metadata = {
  title: 'Polhem.us Admin',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${crimsonPro.variable} ${rubik.variable}`}>
        <AdminProvider>
          <div className="p-4">
            <header className="mb-4">
              <h1 className="font-sans text-3xl">
                <Link href="/admin">Polhem.us Admin</Link>
              </h1>
            </header>
            <main>{children}</main>
          </div>
        </AdminProvider>
      </body>
    </html>
  )
}
