'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Form, Input, Textarea, Button } from '@nextui-org/react'

import { Record as ContentRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/content'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminLoading from './Loading'

export default function AdminContentForm() {
  const { blog } = useAdmin()
  const [record, setRecord] = useState<{
    uri: string
    value: ContentRecord
  }>()
  const [loading, setLoading] = useState(true)
  const [rkey, setRkey] = useState('')
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const newRkey = searchParams.get('rkey')

    if (newRkey) {
      setRkey(newRkey)

      blog?.findContent({ rkey: newRkey }).then((contentRecord) => {
        if (contentRecord) {
          setRecord(contentRecord)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
  }, [blog])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const data: ContentRecord = {
      slug: formData.get('slug')?.toString() as string,
      content: formData.get('content')?.toString() as string,
      createdAt: formData.get('createdAt')?.toString() as string,
      images: [],
    }

    if (rkey) {
      await blog?.updateContent(rkey, data)
    } else {
      await blog?.createContent(data)
    }

    router.push('/admin')
  }

  if (loading) {
    return <AdminLoading />
  }

  return (
    <Form
      className="grid gap-4 px-6 font-sans md:grid-cols-6"
      onSubmit={onFormSubmit}
    >
      <div className="col-span-4 flex flex-col gap-4">
        <Textarea
          label="Content"
          name="content"
          required
          defaultValue={record?.value.content}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <Input
          label="Slug"
          name="slug"
          required
          defaultValue={record?.value.slug}
        />
        <Input
          label="Created At"
          name="createdAt"
          type="datetime-local"
          required
          defaultValue={
            record?.value.createdAt || moment().format('YYYY-MM-DDTHH:mm')
          }
        />
        <div className="flex gap-4">
          {!!rkey ? (
            <Button color="primary" size="lg" className="flex-1" type="submit">
              Update Content
            </Button>
          ) : (
            <Button color="primary" size="lg" className="flex-1" type="submit">
              Create Content
            </Button>
          )}
          <Button
            color="danger"
            size="lg"
            type="button"
            disabled
            className="flex-1"
          >
            Delete Content
          </Button>
        </div>
      </div>
    </Form>
  )
}
