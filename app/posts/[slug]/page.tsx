import moment from 'moment'
import type { WordPressPost } from '@/types'
import { convert } from 'html-to-text'

type PostParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: PostParams }) {
  const [post] = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?slug=${params.slug}`
  ).then((res) => res.json())) as WordPressPost[]

  return {
    title: convert(post.title.rendered, { wordwrap: false }),
    description: convert(post.excerpt.rendered, { wordwrap: false })
  }
}

export async function generateStaticParams() {
  const posts = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts`
  ).then((res) => res.json())) as WordPressPost[]

  return posts.map(({ slug }) => ({ slug }))
}

export default async function PostSingle({ params }: { params: PostParams }) {
  const [post] = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?slug=${params.slug}`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <div className="p-4">
      <h1
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        className="mb-4 text-center font-serif text-5xl"
      />
      <p className="mb-4 text-center text-sm">
        {moment(post.date).format('dddd, MMMM Do YYYY')}
      </p>
      <div
        className="rich-text mx-auto max-w-3xl"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  )
}
