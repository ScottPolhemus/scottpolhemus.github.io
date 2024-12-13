'use client'

import { redirect } from 'next/navigation'

import AdminTagForm from '@/components/admin/TagForm'
import { useClient } from '@/components/admin/ClientProvider'

export default function AdminContentPage() {
  const { session } = useClient()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminTagForm />
}
