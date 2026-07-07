import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { posts } from "@/.velite";
import mdxComponents from "#components/mdx-components";
import { getReadingStats } from "../../../lib/reading-stats.mjs";

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description ?? "",
    openGraph: {
      title: post.title,
      description: post.description ?? "",
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : ["Xuan"],
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const readingStats = getReadingStats(post.content);

  return (
    <>
      <section className="post-paper-shell">
        <header className="post-paper-header">
          <div className="post-paper-edge post-paper-edge-left" />
          <div className="post-paper-edge post-paper-edge-right" />
          <h1 className="mx-auto mb-6 w-full max-w-2xl text-left text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:mb-12 md:text-4xl md:leading-none lg:text-5xl dark:text-neutral-100">
            {post.title}
            <div className="date mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm font-normal tracking-wide text-neutral-500 dark:text-neutral-400">
              <time>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{readingStats.label}</span>
            </div>
          </h1>
          {post.description && (
            <p className="mx-auto w-full max-w-2xl text-base leading-7 text-neutral-500 dark:text-neutral-400">
              {post.description}
            </p>
          )}
        </header>
      </section>
      <article className="post-prose mx-auto mb-8 w-full max-w-2xl px-5 md:mb-10 md:px-0">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
    </>
  );
}
