'use client'

import { Button, Card, CardHeader, CardBody, Divider } from '@nextui-org/react'
import Link from 'next/link'
import { useCallback } from 'react'

import { useAdmin } from '@/components/admin/AdminProvider'
import AdminLoginButton from '@/components/admin/LoginButton'
import AdminResourceList from '@/components/admin/ResourceList'

const sectionHeadingClass = 'text-2xl font-sans font-medium'

export default function AdminPage() {
  const { session, blog } = useAdmin()

  const fetchEntries = useCallback(
    function () {
      return blog?.listEntries(true)
    },
    [blog]
  )

  const fetchContents = useCallback(
    function () {
      return blog?.listContents(true)
    },
    [blog]
  )

  const fetchTags = useCallback(
    function () {
      return blog?.listTags(true)
    },
    [blog]
  )

  if (!session?.sub) {
    return <AdminLoginButton />
  }

  return (
    <div className="m-8 grid gap-4 font-sans sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex justify-between pb-0">
          <h2 className={sectionHeadingClass}>Entries</h2>
          <Button as={Link} href="/admin/entry" color="primary">
            New Entry
          </Button>
        </CardHeader>
        <CardBody>
          <AdminResourceList
            fetchRecords={fetchEntries}
            resourceLabel="Post"
            resourceSlug="entry"
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between pb-0">
          <h2 className={sectionHeadingClass}>Content Blocks</h2>
          <Button as={Link} href="/admin/content" color="primary">
            New Block
          </Button>
        </CardHeader>
        <CardBody>
          <AdminResourceList
            fetchRecords={fetchContents}
            resourceLabel="Content"
            resourceSlug="content"
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between pb-0">
          <h2 className={sectionHeadingClass}>Tags</h2>
          <Button as={Link} href="/admin/tag" color="primary">
            New Tag
          </Button>
        </CardHeader>
        <CardBody>
          <AdminResourceList
            fetchRecords={fetchTags}
            resourceLabel="Tag"
            resourceSlug="tag"
          />
        </CardBody>
      </Card>
    </div>
  )
}
