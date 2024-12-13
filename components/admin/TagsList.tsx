import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { Record as TagRecord } from '@lexicons/tag'

import { useClient } from './ClientProvider'

export default function AdminContentsList() {
  const { blog } = useClient()
  const [tags, setTags] = useState<
    {
      uri: string
      value: TagRecord
    }[]
  >([])

  const refreshTags = useCallback(() => {
    blog?.listTags(true).then((records) => {
      setTags(records)
    })
  }, [blog])

  useEffect(() => {
    refreshTags()
  }, [refreshTags])

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const rkey = (event.target as HTMLButtonElement)
        .closest('[data-rkey]')
        ?.getAttribute('data-rkey')

      if (rkey && confirm('Are you sure?')) {
        blog?.deleteTag(rkey).then(() => {
          refreshTags()
        })
      }
    },
    [blog, refreshTags]
  )

  return (
    <>
      <Link href="/admin/tag" className="button">
        New Tag
      </Link>
      {tags.map((record) => {
        const rkey = record.uri.slice(5).split('/')[2]

        return (
          <div className="my-4" key={rkey} data-rkey={rkey}>
            <h3 className="font-bold">{record.value.name}</h3>
            <p className="flex gap-4">
              <Link className="underline" href={`/admin/tag?rkey=${rkey}`}>
                Edit Tag
              </Link>
              <button className="underline" onClick={onClickDelete}>
                Delete Tag
              </button>
            </p>
          </div>
        )
      })}
    </>
  )
}
