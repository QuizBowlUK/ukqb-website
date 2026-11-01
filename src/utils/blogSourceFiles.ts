import { dirname, resolve } from "node:path";
import type { CollectionEntry } from "astro:content";

export function getBlogSourceFiles(post: CollectionEntry<"blog">) {
  const { filePath } = post;
  if (!filePath)
    throw new Error(`Missing source file for blog post ${post.id}`);
  return [
    filePath,
    `src/assets/blog/${post.data.image.feature ?? post.data.image.teaser.path}`,
    ...(post.rendered?.metadata?.imagePaths ?? [])
      .filter((path) => !URL.canParse(path) && !path.startsWith("//"))
      .map((path) => resolve(dirname(filePath), path)),
  ];
}
