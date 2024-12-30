'use client'

import { redirect } from 'next/navigation'

import AdminEntryForm from '@/components/admin/EntryForm'
import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminEntryPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminEntryForm />
}
