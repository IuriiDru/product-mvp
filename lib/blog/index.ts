import { posts } from "./posts";
import type { Post } from "./types";

export { posts };
export type { Post } from "./types";

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Грубая оценка времени чтения в минутах (по числу слов). */
export function readingTimeMin(post: Post): number {
  let words = 0;
  for (const b of post.blocks) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "callout") {
      words += b.text.trim().split(/\s+/).filter(Boolean).length;
    } else if (b.type === "ul" || b.type === "ol") {
      words += b.items.join(" ").trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(2, Math.round(words / 180));
}
