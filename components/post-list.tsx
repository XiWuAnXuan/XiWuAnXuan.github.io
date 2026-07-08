import PostCard, { type PostCardPost } from '#components/post-card'

export default function PostList({ posts }: { posts: PostCardPost[] }) {
  if (!posts.length) {
    return <p className="text-center text-gray-500">No posts found.</p>
  }

  return (
    <div className="space-y-7">
      {posts.map(post => (
        <div key={post.slug} className="blog-post-item">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  )
}
