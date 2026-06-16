import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleBody from "@/components/ArticleBody";
import { getAllPosts, getPost, readingTimeMin } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://buh.univeige.ru/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      siteName: "Юнивеж",
      locale: "ru_RU",
      images: ["https://buh.univeige.ru/team.jpg"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <article className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="text-sm text-ink-soft transition hover:text-pine">
            ← Все статьи
          </Link>
          <h1 className="mt-4 text-3xl sm:text-[40px]">{post.h1}</h1>
          <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft/70">
            {readingTimeMin(post)} мин чтения
          </p>
          <div className="mt-8">
            <ArticleBody blocks={post.blocks} />
          </div>

          <div className="mt-14 rounded-3xl bg-pine p-8 text-cream">
            <h2 className="text-2xl text-cream">Не уверены, всё ли в порядке с вашим учётом?</h2>
            <p className="mt-2 text-cream/75">
              Пройдите бесплатный экспресс-аудит — за пару минут покажем карту налоговых
              рисков вашей компании прямо на экране.
            </p>
            <Link
              href="/audit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brass-bright px-7 py-4 text-base font-semibold text-pine-deep transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Пройти экспресс-аудит <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
