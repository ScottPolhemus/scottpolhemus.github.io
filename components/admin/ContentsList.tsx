import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { Record as BlogContent } from '@lexicons/content'

import { useClient } from './ClientProvider'

export default function AdminContentsList() {
  const { blog } = useClient()
  const [contents, setContents] = useState<
    {
      uri: string
      value: BlogContent
    }[]
  >([])

  const refreshContents = useCallback(() => {
    blog?.listContents(true).then((records) => {
      setContents(records)
    })
  }, [blog])

  useEffect(() => {
    refreshContents()
  }, [refreshContents])

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const rkey = (event.target as HTMLButtonElement)
        .closest('[data-rkey]')
        ?.getAttribute('data-rkey')

      if (rkey && confirm('Are you sure?')) {
        blog?.deleteContent(rkey).then(() => {
          refreshContents()
        })
      }
    },
    [blog, refreshContents]
  )

  return (
    <>
      <Link href="/admin/content" className="button">
        New Content Block
      </Link>
      {contents.map((record) => {
        const rkey = record.uri.slice(5).split('/')[2]

        return (
          <div className="my-4" key={rkey} data-rkey={rkey}>
            <h4 className="font-bold">{record.value.slug}</h4>
            <p className="flex gap-4">
              <Link className="underline" href={`/admin/content?rkey=${rkey}`}>
                Edit Content Block
              </Link>
              <button className="underline" onClick={onClickDelete}>
                Delete Content Block
              </button>
            </p>
          </div>
        )
      })}
    </>
  )
}
