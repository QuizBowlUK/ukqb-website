import { dirname, resolve } from "node:path";

/** @param {import("astro:content").CollectionEntry<"blog">} post */
export function getBlogSourceFiles(post) {
  if (!post.filePath)
    throw new Error(`Missing source file for blog post ${post.id}`);
  return [
    post.filePath,
    `src/assets/blog/${post.data.image.feature ?? post.data.image.teaser.path}`,
    ...(post.rendered?.metadata?.imagePaths ?? [])
      .filter((path) => !URL.canParse(path) && !path.startsWith("//"))
      .map((path) => resolve(dirname(post.filePath), path)),
  ];
}
