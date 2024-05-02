import Link from 'next/link'
import { WordPressPost, WordPressTag } from '@/types'
import PostDate from '@/components/PostDate'

export default async function PostsList({ tags }: { tags?: WordPressTag[] }) {
  const params = {} as Record<string, string>

  if (typeof tags !== 'undefined') {
    tags.forEach((tag, index) => {
      params[`tags[${index}]`] = tag.id
    })
  }

  const posts = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?${new URLSearchParams(params)}`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <ul>
      {posts.map((post, index) => (
        <li
          key={`post-${index}`}
          className="mb-4 border-b border-black pb-4 last:mb-0 last:border-b-0"
        >
          <Link className="group" href={`/posts/${post.slug}`}>
            <h3 className="font-serif text-xl font-light group-hover:underline">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h3>
            <p>
              <PostDate date={post.date} />
            </p>
            <div
              className="rich-text text-sm"
              dangerouslySetInnerHTML={{
                __html: post.excerpt.rendered.replace(
                  ' [&hellip;]',
                  '&hellip;'
                ),
              }}
            ></div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
