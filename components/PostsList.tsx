import Link from 'next/link'
import PostDate from '@/components/PostDate'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Record as TagRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/tag'

import { BlogClient } from '@/services/blog'
import { getBlogPostExcerpt } from '@/utils/blog'

export default async function PostsList({
  tag,
}: {
  tag?: { uri: string; value: TagRecord }
}) {
  const client = new BlogClient()
  let results = await client.listPosts({ visibility: 'public' })

  if (tag) {
    results = results.filter(({ value }) => value.tags?.includes(tag.uri))
  }

  return (
    <ul className="mx-auto max-w-7xl">
      {results.map((record) => (
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
                {getBlogPostExcerpt(record.value)}
              </Markdown>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
