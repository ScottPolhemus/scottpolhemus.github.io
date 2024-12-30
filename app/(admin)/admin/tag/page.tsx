'use client'

import { redirect } from 'next/navigation'

import AdminTagForm from '@/components/admin/TagForm'
import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminContentPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminTagForm />
}
