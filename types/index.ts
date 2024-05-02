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
}

export interface WordPressTag {
  id: string
  name: string
  description: string
  slug: string
}
