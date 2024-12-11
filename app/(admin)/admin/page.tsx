'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import { useAdmin } from '@/components/AdminProvider'
import AdminLogin from '@/components/AdminLogin'
import AdminPostsList from '@/components/AdminPostsList'

export default function AdminPage() {
  const { session } = useAdmin()

  if (!session?.sub) {
    return <AdminLogin />
  }

  return <AdminPostsList />
}
