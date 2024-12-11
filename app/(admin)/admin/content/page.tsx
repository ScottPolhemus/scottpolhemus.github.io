'use client'

import AdminContentForm from '@/components/AdminContentForm'
import AdminContentsList from '@/components/AdminContentsList'
import { useAdmin } from '@/components/AdminProvider'
import { redirect } from 'next/navigation'

export default function AdminContentPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    redirect('/admin')
  }

  return (
    <>
      <AdminContentsList />
    </>
  )

  // return <AdminPostsList />
}
