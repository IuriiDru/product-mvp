import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-pine/10 bg-pine-deep text-cream/75">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-display text-lg text-cream">Юнивеж</span>
          <span className="ml-3 text-cream/55">© 2011–2026 · бухгалтерский аутсорсинг</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/audit" className="transition hover:text-cream">
            Экспресс-аудит
          </Link>
          <Link href="/blog" className="transition hover:text-cream">
            Блог
          </Link>
          <a href="/privacy" className="transition hover:text-cream">
            Политика обработки ПДн
          </a>
          <a href="/consent" className="transition hover:text-cream">
            Согласие на обработку ПДн
          </a>
        </nav>
      </div>
    </footer>
  );
}
