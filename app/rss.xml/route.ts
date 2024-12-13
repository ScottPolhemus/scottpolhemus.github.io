import { BlogClient } from '@/services/blog'
import { Feed } from 'feed'
import moment from 'moment'

export async function GET() {
  const blog = new BlogClient()
  const posts = await blog.listEntries()

  const feed = new Feed({
    title: 'Polhem.us',
    description: 'The personal blog of Scott Polhemus',
    id: process.env.NEXT_PUBLIC_APP_HOST as string,
    link: `${process.env.NEXT_PUBLIC_APP_HOST}/rss.xml`,
    language: 'en',
    copyright: 'All rights reserved',
  })

  posts.forEach((p) => {
    feed.addItem({
      title: p.value.title,
      link: `${process.env.NEXT_PUBLIC_APP_HOST}/posts/${p.value.slug}`,
      description: '',
      date: moment(p.value.createdAt).toDate(),
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
