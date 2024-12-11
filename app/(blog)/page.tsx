import PostsList from '@/components/PostsList'

export default function Home() {
  return (
    <div className="p-4">
      <h2 className="mx-auto mb-2 max-w-7xl text-xs font-medium uppercase">
        Recent Posts
      </h2>
      <PostsList />
    </div>
  )
}
