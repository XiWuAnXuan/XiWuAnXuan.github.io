import { basename, extname } from "node:path";
import { context, defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.{md,mdx}",
  schema: s
    .object({
      title: s.string(),
      date: s.string(),
      description: s.string().optional(),
      author: s.string().optional(),
      image: s.string().optional(),
      slug: s.string().optional(),
      content: s.raw(),
    })
    .transform((data) => {
      const file = context().file.path;
      const filename = basename(file, extname(file));

      return {
        ...data,
        slug: data.slug ?? filename,
      };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
  },
  collections: { posts },
});
