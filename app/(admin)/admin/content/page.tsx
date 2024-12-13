'use client'

import { redirect } from 'next/navigation'

import AdminContentForm from '@/components/admin/ContentForm'
import { useClient } from '@/components/admin/ClientProvider'

export default function AdminContentPage() {
  const { session } = useClient()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminContentForm />
}
