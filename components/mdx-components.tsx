import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2>{children}</h2>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return <Link href={href ?? "#"}>{children}</Link>;
  },
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ""} loading="lazy" />
  ),
  pre: ({ children }) => <pre>{children}</pre>,
  code: ({ children }) => <code>{children}</code>,

  // Nextra legacy fallbacks
  Callout: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      {children}
    </div>
  ),
  Tabs: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Tab: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Steps: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FileTree: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
};

export default mdxComponents;
