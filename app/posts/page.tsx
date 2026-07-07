import { posts } from "@/.velite";
import PaginationNav from "#components/pagination-nav";
import PostList from "#components/post-list";
import {
  getPaginatedItems,
  getTotalPages,
  POSTS_PER_PAGE,
} from "../../lib/pagination.mjs";

export const metadata = {
  title: "Posts",
  description: "Thoughts on life, work, and everything else.",
};

const sortedPosts = [...posts].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export default function PostsPage() {
  const totalPages = getTotalPages(sortedPosts.length, POSTS_PER_PAGE);
  const currentPosts = getPaginatedItems(sortedPosts, 1, POSTS_PER_PAGE);

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        博客
      </h1>
      <PostList posts={currentPosts} />
      <PaginationNav currentPage={1} totalPages={totalPages} />
    </div>
  );
}
