'use client'

import AdminPostForm from '@/components/AdminPostForm'
import { useAdmin } from '@/components/AdminProvider'
import { redirect } from 'next/navigation'

export default function AdminNewPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminPostForm />
}
