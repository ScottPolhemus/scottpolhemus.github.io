'use client'

import { redirect } from 'next/navigation'

import AdminContentForm from '@/components/admin/ContentForm'
import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminContentPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminContentForm />
}
