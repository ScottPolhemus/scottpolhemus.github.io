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
      <h1 className="mb-4 font-serif text-5xl">{post.title.rendered}</h1>
      <div
        className="rich-text"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  )
}
