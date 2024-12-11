import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { useAdmin } from './AdminProvider'
import { Record as BlogEntry } from '@lexicons/entry'
import Link from 'next/link'
import PostDate from './PostDate'

interface BlogEntryRecord {
  uri: string
  value: BlogEntry
}

export default function AdminPostsList() {
  const { agent, session } = useAdmin()
  const [posts, setPosts] = useState<BlogEntryRecord[]>([])

  const refreshPosts = useCallback(() => {
    agent?.com.atproto.repo
      .listRecords({
        repo: session?.sub as string,
        collection: 'us.polhem.blog.entry',
      })
      .then((records) => {
        setPosts(records.data.records as any as BlogEntryRecord[])
      })
  }, [session, agent])

  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const rkey = (event.target as HTMLButtonElement)
        .closest('[data-rkey]')
        ?.getAttribute('data-rkey')

      if (rkey && confirm('Are you sure?')) {
        agent?.com.atproto.repo
          .deleteRecord({
            rkey,
            repo: session?.sub as string,
            collection: 'us.polhem.blog.entry',
          })
          .then(() => {
            refreshPosts()
          })
      }
    },
    [agent, refreshPosts, session]
  )

  return (
    <>
      <h2 className="text-xl">Posts</h2>
      <Link href="/admin/new" className="underline">
        New Post
      </Link>
      {posts.map((p) => {
        const rkey = p.uri.slice(5).split('/')[2]

        return (
          <div className="my-2" key={rkey} data-rkey={rkey}>
            <h3 className="font-bold">
              <Link className="group" href={`/posts/${p.value.slug}`}>
                {p.value.title}
              </Link>
            </h3>
            <PostDate date={p.value.createdAt as string} />
            <p className="flex gap-4">
              <Link className="underline" href={`/admin/edit?rkey=${rkey}`}>
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
