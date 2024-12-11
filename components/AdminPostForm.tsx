'use client'

import { FormEventHandler, useEffect, useState } from 'react'
import { useAdmin } from './AdminProvider'
import { TID } from '@atproto/common-web'
import { useRouter } from 'next/navigation'

export default function AdminPostForm() {
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
          collection: 'us.polhem.blog.entry',
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
        collection: 'us.polhem.blog.entry',
        rkey: rkey || TID.nextStr(),
        record: {
          title: formData.get('title') as string,
          slug: formData.get('slug') as string,
          content: formData.get('content') as string,
          createdAt: formData.get('createdAt') as string,
          visibility: formData.get('visibility') as string,
        },
      })
      .then(() => {
        router.push('/admin')
      })
  }

  if (rkey && !defaultValues) {
    return 'Loading...'
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label className="block">
        <span className="block">Title</span>
        <input
          className="w-full border"
          name="title"
          required
          defaultValue={defaultValues?.title}
        />
      </label>
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
          defaultValue={defaultValues?.createdAt}
        />
      </label>
      <label className="block">
        <span>Visibility</span>
        <select
          className="border"
          name="visibility"
          required
          defaultValue={defaultValues?.visibility}
        >
          <option value="">--</option>
          <option value="author">Author</option>
          <option value="url">URL</option>
          <option value="public">Public</option>
        </select>
      </label>
      {!!rkey ? (
        <button className="border">Update Post</button>
      ) : (
        <button className="border">Create Post</button>
      )}
    </form>
  )
}
