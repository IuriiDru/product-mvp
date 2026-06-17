import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleBody from "@/components/ArticleBody";
import { getAllPosts, getPost } from "@/lib/blog";

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
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-[760px] px-[22px]">
          <Link href="/blog" className="text-sm text-ink-soft transition hover:text-pine">
            ← Все статьи
          </Link>

          <article className="mt-4 overflow-hidden rounded-[14px] border border-[#e6ddcd] bg-white shadow-[0_2px_14px_rgba(0,33,46,0.05)]">
            {/* Типографическая обложка в фирменной гамме */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pine to-pine-deep px-5 pt-[30px] pb-7 text-cream sm:px-[34px] sm:pt-10 sm:pb-[38px]">
              {post.glyph && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 select-none font-display font-bold leading-none text-white/[0.06] text-[150px] sm:text-[200px]"
                >
                  {post.glyph}
                </span>
              )}
              {post.kicker && (
                <div className="relative text-[12px] font-semibold uppercase tracking-[0.15em] text-[#ffe5b1]">
                  {post.kicker}
                </div>
              )}
              <h1 className="relative mt-3 max-w-[86%] text-[23px] leading-[1.18] text-cream sm:text-[29px]">
                {post.h1}
              </h1>
            </div>

            {/* Тело статьи */}
            <div className="px-5 pt-5 pb-7 sm:px-[34px] sm:pt-[22px] sm:pb-[34px]">
              {/* Плашка автора */}
              <div className="flex items-center gap-[13px] border-b border-[#e6ddcd] pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/author-kobzeva.jpg"
                  alt="Наталья Кобзева"
                  className="h-[54px] w-[54px] flex-none rounded-full border-2 border-[#e6ddcd] object-cover object-[center_16%]"
                />
                <div className="leading-[1.32]">
                  <span className="block text-[15px] font-semibold text-ink">Наталья Кобзева</span>
                  <span className="block text-[13px] text-sage">
                    Аудитор · 20+ лет в налогах · владелец компании «Юнивеж»
                  </span>
                </div>
              </div>

              <ArticleBody blocks={post.blocks} />
            </div>
          </article>

          <div className="mt-10 rounded-[14px] bg-pine p-8 text-cream">
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
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
