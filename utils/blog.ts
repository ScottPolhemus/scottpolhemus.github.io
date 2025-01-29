import { Record as PostRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/post'

export function getBlogPostExcerpt(post: PostRecord) {
  let excerpt = post.excerpt || post.content

  return excerpt.replaceAll('\n', ' ')
}
