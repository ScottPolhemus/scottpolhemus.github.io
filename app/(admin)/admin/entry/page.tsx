'use client'

import { redirect } from 'next/navigation'

import AdminEntryForm from '@/components/admin/EntryForm'
import { useClient } from '@/components/admin/ClientProvider'

export default function AdminEntryPage() {
  const { session } = useClient()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminEntryForm />
}
