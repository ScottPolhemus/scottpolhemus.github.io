import { Record as EntryRecord } from '@/app/__generated__/lexicons/types/us/polhem/blog/entry'

export function getBlogPostExcerpt(entry: EntryRecord) {
  return entry.content.replaceAll('\n', ' ')
}
