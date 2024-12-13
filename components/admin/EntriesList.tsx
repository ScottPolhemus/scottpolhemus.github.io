import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { Record as BlogEntry } from '@lexicons/entry'

import { useClient } from './ClientProvider'
import PostDate from '../PostDate'

export default function AdminEntriesList() {
  const { blog } = useClient()
  const [posts, setPosts] = useState<
    {
      uri: string
      value: BlogEntry
    }[]
  >([])

  const refreshPosts = useCallback(() => {
    blog?.listEntries(true).then((records) => {
      setPosts(records)
    })
  }, [blog])

  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const rkey = (event.target as HTMLButtonElement)
        .closest('[data-rkey]')
        ?.getAttribute('data-rkey')

      if (rkey && confirm('Are you sure?')) {
        blog?.deleteEntry(rkey).then(() => {
          refreshPosts()
        })
      }
    },
    [blog, refreshPosts]
  )

  return (
    <>
      <Link href="/admin/entry" className="button">
        New Entry
      </Link>
      {posts.map((p) => {
        const rkey = p.uri.slice(5).split('/')[2]

        return (
          <div className="my-4" key={rkey} data-rkey={rkey}>
            <h4 className="font-bold">
              <Link href={`/posts/${p.value.slug}`}>{p.value.title}</Link>
            </h4>
            <PostDate date={p.value.createdAt as string} />
            <p className="flex gap-4">
              <Link className="underline" href={`/admin/entry?rkey=${rkey}`}>
                Edit Post
              </Link>
              <button className="underline" onClick={onClickDelete}>
                Delete Post
              </button>
            </p>
          </div>
        )
      })}
    </>
  )
}
