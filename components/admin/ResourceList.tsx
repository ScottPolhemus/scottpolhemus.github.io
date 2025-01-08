import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Link as UILink } from '@nextui-org/react'
import { PressEvent } from '@react-types/shared'

import { Record as PostRecord } from '@lexicons/post'
import { Record as ContentRecord } from '@lexicons/content'
import { Record as TagRecord } from '@lexicons/tag'

import { parseAtProtoUri } from '@/utils/atProto'
import PostDate from '../PostDate'
import { useAdmin } from './AdminProvider'

export default function AdminResourceList<
  RecordType = PostRecord | ContentRecord | TagRecord,
>({
  fetchRecords,
  resourceLabel,
  resourceSlug,
}: {
  fetchRecords: () => Promise<{ uri: string; value: RecordType }[]> | undefined
  resourceLabel: string
  resourceSlug: string
}) {
  const { blog } = useAdmin()
  const [records, setRecords] = useState<
    {
      uri: string
      value: RecordType
    }[]
  >([])

  const refreshRecords = useCallback(() => {
    fetchRecords()?.then((records) => {
      setRecords(records)
    })
  }, [fetchRecords])

  useEffect(() => {
    refreshRecords()
  }, [refreshRecords])

  const onClickDelete = useCallback(
    (e: PressEvent) => {
      const rkey = (e.target as HTMLButtonElement)
        .closest('[data-rkey]')
        ?.getAttribute('data-rkey')

      if (rkey && confirm('Are you sure?')) {
        blog?.deletePost(rkey).then(() => {
          refreshRecords()
        })
      }
    },
    [blog, refreshRecords]
  )

  return records.map((p) => {
    const { rkey, collection } = parseAtProtoUri(p.uri)

    let url = ''
    let title = ''
    let createdAt = ''

    switch (collection) {
      case 'us.polhem.blog.post': {
        const post = p.value as PostRecord
        url = `/posts/${post.slug}`
        title = post.title
        createdAt = post.createdAt
        break
      }
      case 'us.polhem.blog.content': {
        const content = p.value as ContentRecord
        title = content.slug
        createdAt = content.createdAt
        break
      }
      case 'us.polhem.blog.tag': {
        const tag = p.value as TagRecord
        title = tag.name
        url = `/tag/${tag.slug}`
        createdAt = tag.createdAt
        break
      }
    }

    return (
      <div className="mb-6 last:mb-0" key={rkey} data-rkey={rkey}>
        <h4 className="font-bold">
          {url ? <Link href={url}>{title}</Link> : title}
        </h4>
        <PostDate date={createdAt} />
        <p className="flex gap-4">
          <UILink
            as={Link}
            href={`/admin/${resourceSlug}?rkey=${rkey}`}
            color="foreground"
            className="underline"
          >
            Edit {resourceLabel}
          </UILink>
          <UILink
            as="button"
            onPress={onClickDelete}
            color="foreground"
            className="underline hover:text-danger focus:text-danger active:text-danger"
          >
            Delete {resourceLabel}
          </UILink>
        </p>
      </div>
    )
  })
}
