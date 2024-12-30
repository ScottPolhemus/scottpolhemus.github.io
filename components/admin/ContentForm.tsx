'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'

import { Record as ContentRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/content'
import { useAdmin } from '@/components/admin/AdminProvider'

export default function AdminContentForm() {
  const { blog } = useAdmin()
  const [record, setRecord] = useState<{
    uri: string
    value: ContentRecord
  }>()
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
        }
      })
    }
  }, [blog])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      createdAt: formData.get('createdAt') as string,
      images: [],
    }

    if (rkey) {
      await blog?.updateContent(rkey, data)
    } else {
      await blog?.createContent(data)
    }

    router.push('/admin')
  }

  if (rkey && !record) {
    return 'Loading...'
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label className="block">
        <span className="block">Slug</span>
        <input
          className="w-full border"
          name="slug"
          required
          defaultValue={record?.value.slug}
        />
      </label>
      <label className="block">
        <span className="block">Content</span>
        <textarea
          className="h-[500px] w-full border"
          name="content"
          required
          defaultValue={record?.value.content}
        />
      </label>
      <label className="block">
        <span>Created At</span>
        <input
          className="border"
          name="createdAt"
          type="datetime-local"
          defaultValue={
            record?.value.createdAt || moment().format('YYYY-MM-DDTHH:mm')
          }
        />
      </label>
      <label className="block">
        <span className="block">Content Images</span>
        <input className="w-full border" name="images" type="file" multiple />
      </label>
      {!!rkey ? (
        <button className="border">Update Content Block</button>
      ) : (
        <button className="border">Create Content Block</button>
      )}
    </form>
  )
}
