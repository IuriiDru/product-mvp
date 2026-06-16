// Яндекс.Метрика — номер счётчика и хелпер для отправки целей (reachGoal).
// Счётчик подключается в app/layout.tsx (для React-страниц) и в статических
// HTML (public/landing.html, privacy.html, consent.html).
export const YM_ID = 109893760;

type YmFn = (id: number, action: string, ...args: unknown[]) => void;

// Безопасно отправляет цель в Метрику. Если счётчик ещё не загрузился
// (или скрипт заблокирован), просто ничего не делает — без ошибок.
export function ymGoal(target: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const ym = (window as unknown as { ym?: YmFn }).ym;
  if (typeof ym === "function") {
    ym(YM_ID, "reachGoal", target, params);
  }
}
