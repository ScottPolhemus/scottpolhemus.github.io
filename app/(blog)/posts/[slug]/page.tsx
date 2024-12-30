import PostDate from '@/components/PostDate'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { BlogClient } from '@/services/blog'

type PostParams = {
  slug: string
}

const blog = new BlogClient()

export async function generateMetadata({ params }: { params: PostParams }) {
  const posts = await blog.listEntries()
  const post = posts.find((record) => {
    return record.value.slug === params.slug
  })

  return {
    title: post?.value.title,
    // description: convert(post.excerpt.rendered, { wordwrap: false }),
    openGraph: {
      images: [
        post?.value.featuredImage &&
          `https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${post.value.featuredImage.image.ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}`,
      ].filter(Boolean),
    },
  }
}

export async function generateStaticParams() {
  const posts = await blog.listEntries()

  return posts.map((record) => ({ slug: record.value.slug }))
}

export default async function PostSingle({ params }: { params: PostParams }) {
  const post = await blog.findEntry({ slug: params.slug })

  // Replace relative image paths with getBlob URLs
  const postContent = post?.value.content.replaceAll(
    /src="\.\/([^"]*)"/gm,
    (match, filename) => {
      const image = post.value.images?.find((i) => i.filename === filename)

      return `src="https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${image?.image.ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}"`
    }
  )

  return (
    <div className="p-4">
      <div className="mb-4 md:text-center">
        <h1 className="mx-auto mb-2 max-w-5xl font-serif text-5xl font-light">
          {post?.value.title}
        </h1>
        <p>
          <PostDate date={post?.value.createdAt as string} />
        </p>
      </div>
      <div className="rich-text mx-auto max-w-3xl">
        <Markdown rehypePlugins={[rehypeRaw]}>{postContent}</Markdown>
      </div>
    </div>
  )
}
