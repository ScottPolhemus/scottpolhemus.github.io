import Link from 'next/link'
import { Crimson_Pro, Rubik } from 'next/font/google'
import { Navbar, NavbarBrand } from '@nextui-org/react'

import AdminProvider from '@/components/admin/AdminProvider'
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
          <Navbar>
            <NavbarBrand>
              <h1 className="font-sans text-2xl">
                <Link href="/admin">Polhem.us Dashboard</Link>
              </h1>
            </NavbarBrand>
          </Navbar>
          <main>{children}</main>
        </AdminProvider>
      </body>
    </html>
  )
}
