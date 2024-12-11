'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import { useAdmin } from './AdminProvider'
import { TID } from '@atproto/common-web'
import { useRouter } from 'next/navigation'
import moment from 'moment'

export default function AdminContentForm() {
  const { session, agent } = useAdmin()
  const [defaultValues, setDefaultValues] = useState()
  const [rkey, setRkey] = useState('')
  const router = useRouter()
  // const searchParams = new URLSearchParams(window.location.search)
  // const rkey = searchParams.get('rkey')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const newRkey = searchParams.get('rkey')
    if (newRkey) {
      setRkey(newRkey)
      agent?.com.atproto.repo
        .getRecord({
          rkey: newRkey,
          repo: session?.sub as string,
          collection: 'us.polhem.blog.content',
        })
        .then((response) => {
          setDefaultValues(response.data.value)
        })
    }
  }, [agent, session, rkey])

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    agent?.com.atproto.repo
      .putRecord({
        repo: session?.sub as string,
        collection: 'us.polhem.blog.content',
        rkey: rkey || TID.nextStr(),
        record: {
          slug: formData.get('slug') as string,
          content: formData.get('content') as string,
          createdAt: formData.get('createdAt') as string,
        },
      })
      .then(() => {
        router.push('/admin/content')
      })
  }

  if (rkey && !defaultValues) {
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
          defaultValue={defaultValues?.slug}
        />
      </label>
      <label className="block">
        <span className="block">Content</span>
        <textarea
          className="h-[500px] w-full border"
          name="content"
          required
          defaultValue={defaultValues?.content}
        />
      </label>
      <label className="block">
        <span>Created At</span>
        <input
          className="border"
          name="createdAt"
          type="datetime-local"
          defaultValue={
            defaultValues?.createdAt || moment().format('YYYY-MM-DDTHH:mm')
          }
        />
      </label>
      {!!rkey ? (
        <button className="border">Update Content</button>
      ) : (
        <button className="border">Create Content</button>
      )}
    </form>
  )
}
