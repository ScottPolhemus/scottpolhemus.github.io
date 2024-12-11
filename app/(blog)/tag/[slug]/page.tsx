import type { WordPressTag } from '@/types'
import PostsList from '@/components/PostsList'

type TagParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: TagParams }) {
  const tags = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/tags`
  ).then((res) => res.json())) as WordPressTag[]
  const tag = tags.find(({ slug }) => slug == params.slug)

  return {
    title: tag?.name,
    description: tag?.description,
  }
}

export async function generateStaticParams() {
  const tags = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/tags`
  ).then((res) => res.json())) as WordPressTag[]

  return tags.map(({ slug }) => ({
    slug,
  }))
}

export default async function TagSingle({ params }: { params: TagParams }) {
  const tags = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/tags`
  ).then((res) => res.json())) as WordPressTag[]
  const tag = tags.find(({ slug }) => slug == params.slug) as WordPressTag

  return (
    <div className="p-4">
      <h2 className="mb-2 text-xs font-medium uppercase">
        Posts tagged &ldquo;{tag?.name}&rdquo;
      </h2>
      <PostsList tags={[tag]} />
    </div>
  )
}
