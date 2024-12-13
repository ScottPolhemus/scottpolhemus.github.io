'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'

import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'
import { useClient } from '@/components/admin/ClientProvider'

export default function AdminContentForm() {
  const { blog } = useClient()
  const [record, setRecord] = useState<{
    uri: string
    value: TagRecord
  }>()
  const [rkey, setRkey] = useState('')
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const newRkey = searchParams.get('rkey')

    if (newRkey) {
      setRkey(newRkey)

      blog?.findTag({ rkey: newRkey }).then((tagRecord) => {
        if (tagRecord) {
          setRecord(tagRecord)
        }
      })
    }
  }, [blog])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      createdAt: formData.get('createdAt') as string,
      images: [],
    }

    if (rkey) {
      await blog?.updateTag(rkey, data)
    } else {
      await blog?.createTag(data)
    }

    router.push('/admin')
  }

  if (rkey && !record) {
    return 'Loading...'
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label className="block">
        <span className="block">Name</span>
        <input
          className="w-full border"
          name="name"
          required
          defaultValue={record?.value.name}
        />
      </label>
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
        <span className="block">Description</span>
        <textarea
          className="h-[500px] w-full border"
          name="description"
          defaultValue={record?.value.description}
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
      {!!rkey ? (
        <button className="border">Update Tag</button>
      ) : (
        <button className="border">Create Tag</button>
      )}
    </form>
  )
}
