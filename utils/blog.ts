import { Record as PostRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/post'

export function getBlogPostExcerpt(post: PostRecord) {
  return post.content.replaceAll('\n', ' ')
}
