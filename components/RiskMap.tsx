import { type AuditResult, type Level, LEVEL_LABEL } from "@/lib/audit";

const levelText: Record<Level, string> = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
};
const levelBar: Record<Level, string> = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
};
const levelRing: Record<Level, string> = {
  low: "border-risk-low",
  medium: "border-risk-medium",
  high: "border-risk-high",
};

const overallMessage: Record<Level, string> = {
  low: "Серьёзных налоговых рисков не видно. Главное — поддерживать порядок дальше.",
  medium: "Есть зоны риска, которые стоит закрыть, пока они не превратились в доначисления.",
  high: "Рисков много, и цена ошибки высокая. Рекомендуем полный аудит как можно скорее.",
};

export default function RiskMap({ result }: { result: AuditResult }) {
  return (
    <div className="animate-fade-up">
      {/* Общий уровень */}
      <div className="rounded-3xl border border-pine/10 bg-paper-2 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
          Ваша карта налоговых рисков
        </p>
        <div
          className={`mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full border-4 ${levelRing[result.level]} bg-paper`}
        >
          <div className="text-center">
            <div className="font-display text-5xl leading-none">{result.overall}</div>
            <div className="text-xs text-ink-soft">из 100</div>
          </div>
        </div>
        <p className={`mt-5 font-display text-2xl ${levelText[result.level]}`}>
          {LEVEL_LABEL[result.level]} уровень риска
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          {overallMessage[result.level]}
        </p>
      </div>

      {/* По категориям */}
      <div className="mt-6 space-y-4">
        {result.categories.map((c) => (
          <div
            key={c.key}
            className="rounded-2xl border border-pine/10 bg-paper-2 p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg">{c.label}</h3>
              <span className={`text-sm font-semibold ${levelText[c.level]}`}>
                {LEVEL_LABEL[c.level]} · {c.score}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-pine/10">
              <div
                className={`h-full rounded-full ${levelBar[c.level]}`}
                style={{ width: `${Math.max(4, c.score)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-ink-soft">{c.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
