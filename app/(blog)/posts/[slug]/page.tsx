import { convert } from 'html-to-text'
import type { WordPressPost } from '@/types'
import PostDate from '@/components/PostDate'
import { Agent } from '@atproto/api'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

type PostParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: PostParams }) {
  const agent = new Agent('https://bsky.social')

  const { data } = await agent.com.atproto.repo.listRecords({
    repo: process.env.NEXT_PUBLIC_ATPROTO_DID,
    collection: 'us.polhem.blog.entry',
  })
  const post = data.records.find((record) => {
    return record.value.slug === params.slug
  })
  // const [post] = (await fetch(
  //   `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?slug=${params.slug}&ts=${Date.now()}`
  // ).then((res) => res.json())) as WordPressPost[]

  return {
    title: post?.value.title,
    // description: convert(post.excerpt.rendered, { wordwrap: false }),
    openGraph: {
      // images: [
      //   post.jetpack_featured_media_url && {
      //     url: post.jetpack_featured_media_url,
      //   },
      // ].filter(Boolean),
    },
  }
}

export async function generateStaticParams() {
  const agent = new Agent('https://bsky.social')

  const { data } = await agent.com.atproto.repo.listRecords({
    repo: process.env.NEXT_PUBLIC_ATPROTO_DID,
    collection: 'us.polhem.blog.entry',
  })

  const posts = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts?ts=${Date.now()}`
  ).then((res) => res.json())) as WordPressPost[]

  return data.records.map((record) => ({ slug: record.value.slug }))
}

export default async function PostSingle({ params }: { params: PostParams }) {
  const agent = new Agent('https://bsky.social')

  const { data } = await agent.com.atproto.repo.listRecords({
    repo: process.env.NEXT_PUBLIC_ATPROTO_DID as string,
    collection: 'us.polhem.blog.entry',
  })
  const post = data.records.find((record) => {
    return record.value.slug === params.slug
  })

  return (
    <div className="p-4">
      <div className="mb-4 md:text-center">
        <h1 className="mx-auto mb-2 max-w-5xl font-serif text-5xl font-light">
          {post?.value.title}
        </h1>
        <p>
          <PostDate date={post.value.createdAt} />
        </p>
      </div>
      <div className="rich-text mx-auto max-w-3xl">
        <Markdown rehypePlugins={[rehypeRaw]}>{post?.value.content}</Markdown>
      </div>
    </div>
  )
}
