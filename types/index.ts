export interface WordPressPost {
  slug: string
  title: {
    rendered: string
  }
  date: string
  excerpt: {
    rendered: string
  }
  content: {
    rendered: string
  }
  author: {
    name: string
  }
  jetpack_featured_media_url: string
}

export interface WordPressTag {
  id: string
  name: string
  description: string
  slug: string
}
