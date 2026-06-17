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
      <main className="flex-1">
        {/* Типографическая обложка статьи в фирменной гамме */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pine to-pine-deep text-cream">
          {post.glyph && (
            <span
              aria-hidden
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none font-display font-bold leading-none text-white/[0.06] text-[150px] sm:text-[220px]"
            >
              {post.glyph}
            </span>
          )}
          <div className="relative mx-auto max-w-3xl px-6 py-12 sm:py-16">
            <Link href="/blog" className="text-sm text-cream/70 transition hover:text-cream">
              ← Все статьи
            </Link>
            {post.kicker && (
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.15em] text-[#ffe5b1]">
                {post.kicker}
              </p>
            )}
            <h1 className="mt-3 max-w-2xl text-3xl leading-tight text-cream sm:text-[40px]">
              {post.h1}
            </h1>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-6 py-10">
          {/* Плашка автора */}
          <div className="flex items-center gap-3 border-b border-pine/10 pb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/author-kobzeva.jpg"
              alt="Наталья Кобзева"
              className="h-14 w-14 flex-none rounded-full object-cover object-[center_16%] ring-1 ring-pine/15"
            />
            <div className="leading-tight">
              <span className="block font-medium text-ink">Наталья Кобзева</span>
              <span className="block text-sm text-ink-soft">
                Аудитор · 20+ лет в налогах · владелец компании «Юнивеж»
              </span>
            </div>
            <span className="ml-auto hidden whitespace-nowrap text-xs uppercase tracking-wide text-ink-soft/70 sm:block">
              {readingTimeMin(post)} мин чтения
            </span>
          </div>

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
