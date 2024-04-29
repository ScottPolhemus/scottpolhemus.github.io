import { WordPressPost } from '@/types'

export default async function Home() {
  const posts = (await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/${process.env.WORDPRESS_COM_DOMAIN}/posts`
  ).then((res) => res.json())) as WordPressPost[]

  return (
    <div className="p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase">Recent Posts</h2>
      <ul>
        {posts.map((post, index) => (
          <li
            key={`post-${index}`}
            className="mb-4 border-b border-black pb-4 last:mb-0 last:border-b-0"
          >
            <h3 className="mb-2 font-serif text-xl">{post.title.rendered}</h3>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
