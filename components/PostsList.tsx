import { ComponentProps } from 'react'
import Link from 'next/link'
import { WordPressPost, WordPressTag } from '@/types'
import PostDate from '@/components/PostDate'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { UsPolhemBlogEntry } from '@/app/__generated__/lexicons'
import { BlogClient } from '@/services/blog'
import Image from 'next/image'

export default async function PostsList({ tags }: { tags?: WordPressTag[] }) {
  const params = {} as Record<string, string>

  if (typeof tags !== 'undefined') {
    tags.forEach((tag, index) => {
      params[`tags[${index}]`] = tag.id
    })
  }

  const client = new BlogClient()
  const entryRecords = await client.listEntries()

  return (
    <ul className="mx-auto max-w-7xl">
      {entryRecords.map((record) => (
        <li
          key={record.uri}
          className="mb-4 border-b border-black pb-4 last:mb-0 last:border-b-0"
        >
          <Link className="group" href={`/posts/${record.value.slug}`}>
            <h3 className="font-serif text-xl font-light group-hover:underline">
              {record.value.title}
            </h3>
            <p>
              <PostDate date={record.value.createdAt} />
            </p>
            <div className="rich-text text-sm [&_strong]:font-normal">
              <Markdown
                rehypePlugins={[rehypeRaw]}
                allowedElements={['p', 'strong']}
                className="line-clamp-2"
              >
                {record.value.content}
              </Markdown>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
