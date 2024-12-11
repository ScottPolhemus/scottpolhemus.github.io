import Link from 'next/link'
import { WordPressPost, WordPressTag } from '@/types'
import PostDate from '@/components/PostDate'
import { Agent } from '@atproto/api'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default async function PostsList({ tags }: { tags?: WordPressTag[] }) {
  const params = {} as Record<string, string>

  if (typeof tags !== 'undefined') {
    tags.forEach((tag, index) => {
      params[`tags[${index}]`] = tag.id
    })
  }

  const agent = new Agent('https://bsky.social')

  const { data } = await agent.com.atproto.repo.listRecords({
    repo: process.env.NEXT_PUBLIC_ATPROTO_DID,
    collection: 'us.polhem.blog.entry',
  })

  return (
    <ul className="mx-auto max-w-7xl">
      {data.records.map((record, index) => (
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
            <div className="rich-text text-sm">
              <Markdown
                rehypePlugins={[rehypeRaw]}
                allowedElements={['p']}
                className="line-clamp-2"
              >
                {record.value.content.replaceAll('\n', ' ')}
              </Markdown>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
