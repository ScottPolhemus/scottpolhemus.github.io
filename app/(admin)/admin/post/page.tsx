'use client'

import { redirect } from 'next/navigation'

import AdminPostForm from '@/components/admin/PostForm'
import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminPostPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return redirect('/admin')
  }

  return <AdminPostForm />
}
