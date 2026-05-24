import PostDate from '@/components/PostDate'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { BlogClient } from '@/services/blog'

type PostParams = {
  slug: string
}

const blog = new BlogClient()

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>
}) {
  const { slug } = await params
  const post = await blog.findDocument({ path: `/posts/${slug}` })

  return {
    title: post?.value.title,
    description: post?.value.description,
    openGraph: {
      // images: [
      //   post?.value.featuredImage &&
      //     `https://bsky.social/xrpc/com.atproto.sync.getBlob?cid=${post.value.featuredImage.image.ref}&did=${process.env.NEXT_PUBLIC_ATPROTO_DID}`,
      // ].filter(Boolean),
    },
  }
}

export async function generateStaticParams() {
  const posts = (await blog.listDocuments())?.filter(({ value }) =>
    value.path?.startsWith('/posts/')
  )

  return posts.map((record) => ({
    slug: record.value.path?.slice('/posts/'.length),
  }))
}

export default async function PostSingle({
  params,
}: {
  params: Promise<PostParams>
}) {
  const { slug } = await params
  const post = await blog.findDocument({ path: `/posts/${slug}` })

  if (!post?.value) {
    // 404
    return null
  }

  // Replace absolute paths with domain-relative paths
  const postContent = (post.value.content as string | undefined)?.replaceAll(
    /https\:\/\/polhem\.us\//gm,
    '/'
  )

  return (
    <div className="p-4">
      <div className="mb-4 md:text-center">
        <h1 className="mx-auto mb-2 max-w-5xl font-serif text-5xl font-light">
          {post?.value.title}
        </h1>
        <p>
          <PostDate date={post?.value.publishedAt as string} />
        </p>
      </div>
      <div className="rich-text mx-auto max-w-3xl">
        <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {postContent}
        </Markdown>
      </div>
    </div>
  )
}
