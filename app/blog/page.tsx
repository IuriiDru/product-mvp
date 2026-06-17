import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getAllPosts, readingTimeMin } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Блог о бухгалтерии и налогах для бизнеса на ОСНО — Юнивеж",
  description:
    "Статьи Юнивеж для собственников: как выбрать бухгалтера на аутсорсе, признаки запущенного учёта, налоговые риски на ОСНО, цена бухобслуживания.",
  alternates: { canonical: "https://buh.univeige.ru/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">Блог</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Бухгалтерия и налоги — понятным языком</h1>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Разбираем то, что важно собственнику бизнеса: как устроен учёт, где
            возникают налоговые риски и на что ему обращать свое внимание.
          </p>

          <div className="mt-10 space-y-5">
            {posts.length === 0 && (
              <p className="text-ink-soft">Скоро здесь появятся статьи.</p>
            )}
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block rounded-3xl border border-pine/10 bg-paper-2 p-6 transition hover:-translate-y-0.5 hover:border-brass/40 hover:shadow-lg sm:p-7"
              >
                <h2 className="text-xl text-pine sm:text-2xl">{p.h1}</h2>
                <p className="mt-2 text-ink-soft">{p.excerpt}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-ink-soft/70">
                  {readingTimeMin(p)} мин чтения
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
