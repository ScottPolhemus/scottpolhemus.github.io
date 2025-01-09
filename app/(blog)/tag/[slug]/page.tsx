import { BlogClient } from '@/services/blog'
import PostsList from '@/components/PostsList'

type TagParams = {
  slug: string
}

const blog = new BlogClient()

export async function generateMetadata({ params }: { params: TagParams }) {
  const tags = await blog.listTags()
  const tag = tags.find(({ value }) => value.slug === params.slug)

  return {
    title: tag?.value.name,
    description: tag?.value.description,
  }
}

export async function generateStaticParams() {
  const tags = await blog.listTags()
  return tags.map(({ value }) => ({
    slug: value.slug,
  }))
}

export default async function TagSingle({ params }: { params: TagParams }) {
  const tags = await blog.listTags()
  const tag = tags.find(({ value }) => value.slug === params.slug)
  console.log({ tag })

  return (
    <div className="p-4">
      <h2 className="mx-auto mb-2 max-w-7xl text-xs font-medium uppercase">
        Posts tagged &ldquo;{tag?.value.name}&rdquo;
      </h2>
      <PostsList tag={tag} />
    </div>
  )
}
