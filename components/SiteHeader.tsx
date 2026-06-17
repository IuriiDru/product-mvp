import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-pine/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-brass font-display text-xl text-pine">
            Ю
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl">Юнивеж</span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              бухгалтерский аутсорсинг
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-ink-soft transition hover:text-pine sm:block"
          >
            Статьи
          </Link>
          <Link
            href="/audit"
            className="rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-cream transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Пройти аудит
          </Link>
        </div>
      </div>
    </header>
  );
}
