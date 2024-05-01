import moment from 'moment'
import type { WordPressPost } from '@/types'

export async function generateStaticParams() {
  const posts = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts`
  ).then((res) => res.json())) as WordPressPost[]

  return posts.map(({ slug }) => ({ slug }))
}

export default async function PostSingle({
  params,
}: {
  params: { slug: string }
}) {
  const [post] = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?slug=${params.slug}`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <div className="p-4">
      <h1
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        className="mb-4 font-serif text-5xl text-center"
      />
      <p className="text-center text-sm mb-4">{moment(post.date).format("dddd, MMMM Do YYYY")}</p>
      <div
        className="rich-text max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  )
}
