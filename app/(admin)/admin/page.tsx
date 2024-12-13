'use client'

import { useClient } from '@/components/admin/ClientProvider'
import AdminLoginButton from '@/components/admin/LoginButton'
import AdminEntriesList from '@/components/admin/EntriesList'
import AdminContentsList from '@/components/admin/ContentsList'
import AdminTagsList from '@/components/admin/TagsList'

const sectionHeadingClass = 'text-2xl font-sans font-medium mb-4'

export default function AdminPage() {
  const { session } = useClient()

  if (!session?.sub) {
    return <AdminLoginButton />
  }

  return (
    <>
      <h2 className={sectionHeadingClass}>Entries</h2>
      <AdminEntriesList />
      <h2 className={sectionHeadingClass}>Content Blocks</h2>
      <AdminContentsList />
      <h2 className={sectionHeadingClass}>Tags</h2>
      <AdminTagsList />
    </>
  )
}
