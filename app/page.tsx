import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CATEGORIES, QUESTIONS } from "@/lib/audit";

const STEPS = [
  {
    n: "01",
    title: "Отвечаете на вопросы",
    text: `${QUESTIONS.length} коротких вопросов о вашей компании — режим, НДС, ВЭД, обороты, история проверок.`,
  },
  {
    n: "02",
    title: "Получаете карту рисков",
    text: "Мгновенный результат: общий уровень риска и разбивка по 5 категориям с рекомендациями.",
  },
  {
    n: "03",
    title: "Заказываете полный аудит",
    text: "Если есть зоны риска — оставляете заявку, и бухгалтер Юнивеж проводит глубокий разбор.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            <span className="h-px w-8 bg-brass" />
            Бесплатно · {QUESTIONS.length} вопросов · ~2 минуты
          </p>
          <h1 className="mt-6 text-5xl sm:text-6xl">
            Экспресс-аудит
            <br />
            налоговых рисков
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            Узнайте, где у вашей компании зоны налогового риска — до того, как их
            найдёт ФНС. Пройдите короткий опрос и получите персональную карту рисков.
          </p>
          <div className="mt-9">
            <Link
              href="/audit"
              className="inline-flex items-center gap-3 rounded-full bg-pine px-8 py-4 text-base font-semibold text-cream shadow-lg transition hover:-translate-y-0.5"
            >
              Начать бесплатный аудит
              <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-soft">
            Без регистрации · результат сразу на экране
          </p>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-pine/10 bg-paper-2 p-7"
              >
                <span className="font-display text-3xl text-brass">{s.n}</span>
                <h3 className="mt-4 font-display text-xl">{s.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-center text-3xl">Что проверяем</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink-soft">
            Карта рисков охватывает ключевые зоны учёта компаний на ОСНО.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <span
                key={c.key}
                className="rounded-full border border-pine/15 bg-paper-2 px-5 py-2.5 text-sm font-medium"
              >
                {c.label}
              </span>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/audit"
              className="inline-flex items-center gap-3 rounded-full border border-pine/30 px-8 py-4 text-base font-semibold transition hover:border-pine hover:bg-pine/5"
            >
              Пройти экспресс-аудит
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
