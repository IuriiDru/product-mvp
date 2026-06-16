// Типы данных блога. Статьи хранятся структурированными блоками (без сырого HTML),
// рендерятся компонентом ArticleBody. В тексте абзацев/пунктов допускаются
// **полужирный** и внутренние ссылки [текст](/audit) — их разбирает рендерер.

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "cta"; label: string; href: string };

export interface Post {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  targetKeyword: string;
  excerpt: string;
  /** Дата публикации в формате YYYY-MM-DD (для sitemap и карточек). */
  date: string;
  blocks: Block[];
}
