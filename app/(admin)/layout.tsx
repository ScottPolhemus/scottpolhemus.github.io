import AdminProvider from '@/components/AdminProvider'

import '../globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Polhem.us Admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <div className="p-4">
            <header className="mb-4">
              <h1 className="text-3xl">
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
