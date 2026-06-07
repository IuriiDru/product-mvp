// Ядро продукта: вопросы экспресс-аудита + движок оценки налоговых рисков.
// Чистый TypeScript без зависимостей — считается на клиенте, легко тестируется.

export type CategoryKey = "vat" | "profit" | "wed" | "inspections" | "penalties";
export type Level = "low" | "medium" | "high";

export interface AuditOption {
  label: string;
  /** Сколько баллов риска добавляет вариант в каждую категорию. */
  risk: Partial<Record<CategoryKey, number>>;
}

export interface AuditQuestion {
  id: string;
  title: string;
  help?: string;
  options: AuditOption[];
}

/** Ответы пользователя: id вопроса -> индекс выбранного варианта. */
export type Answers = Record<string, number>;

export interface CategoryResult {
  key: CategoryKey;
  label: string;
  short: string;
  score: number; // 0..100
  level: Level;
  recommendation: string;
}

export interface AuditResult {
  overall: number; // 0..100
  level: Level;
  categories: CategoryResult[];
}

export const CATEGORIES: { key: CategoryKey; label: string; short: string }[] = [
  { key: "vat", label: "НДС", short: "НДС" },
  { key: "profit", label: "Налог на прибыль", short: "Прибыль" },
  { key: "wed", label: "ВЭД и валютный контроль", short: "ВЭД" },
  { key: "inspections", label: "Проверки ФНС", short: "Проверки" },
  { key: "penalties", label: "Штрафы и блокировки", short: "Штрафы" },
];

export const LEVEL_LABEL: Record<Level, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const QUESTIONS: AuditQuestion[] = [
  {
    id: "mode",
    title: "Какой у вас налоговый режим?",
    options: [
      { label: "ОСНО (общая система)", risk: { vat: 2, profit: 3, inspections: 2 } },
      { label: "УСН «Доходы минус расходы»", risk: { profit: 1 } },
      { label: "УСН «Доходы»", risk: {} },
      { label: "Патент / НПД / другой", risk: {} },
    ],
  },
  {
    id: "vatPayer",
    title: "Платите ли вы НДС?",
    options: [
      { label: "Да", risk: { vat: 2 } },
      { label: "Нет", risk: {} },
      { label: "Не уверен(а)", risk: { vat: 3, inspections: 1 } },
    ],
  },
  {
    id: "wed",
    title: "Ведёте ли внешнеэкономическую деятельность (импорт/экспорт, валютные контракты)?",
    options: [
      { label: "Да, регулярно", risk: { wed: 4, vat: 1 } },
      { label: "Иногда", risk: { wed: 2 } },
      { label: "Нет", risk: {} },
    ],
  },
  {
    id: "turnover",
    title: "Примерный годовой оборот компании",
    options: [
      { label: "До 60 млн ₽", risk: {} },
      { label: "60–150 млн ₽", risk: { inspections: 1 } },
      { label: "150–500 млн ₽", risk: { inspections: 2, penalties: 1 } },
      { label: "Более 500 млн ₽", risk: { inspections: 3, penalties: 1 } },
    ],
  },
  {
    id: "who",
    title: "Кто сейчас ведёт вашу бухгалтерию?",
    options: [
      { label: "Штатный бухгалтер", risk: { penalties: 1 } },
      { label: "Аутсорс (другая компания / частный бухгалтер)", risk: {} },
      { label: "Веду сам(а) / директор", risk: { vat: 2, profit: 2, inspections: 1, penalties: 1 } },
      { label: "Никто системно", risk: { vat: 3, profit: 3, inspections: 2, penalties: 3 } },
    ],
  },
  {
    id: "timeliness",
    title: "Сдаёте отчётность и платите налоги вовремя?",
    options: [
      { label: "Всегда вовремя", risk: {} },
      { label: "Иногда бывают задержки", risk: { penalties: 2, inspections: 1 } },
      { label: "Часто возникают проблемы", risk: { penalties: 4, inspections: 2 } },
      { label: "Не уверен(а)", risk: { penalties: 2, inspections: 1 } },
    ],
  },
  {
    id: "history",
    title: "За последние 2 года были требования ФНС, доначисления или блокировки счёта?",
    options: [
      { label: "Нет, ничего такого", risk: {} },
      { label: "Были требования / запросы ФНС", risk: { inspections: 2, penalties: 1 } },
      { label: "Были доначисления или блокировки счёта", risk: { inspections: 3, penalties: 3, vat: 1 } },
    ],
  },
  {
    id: "vatGaps",
    title: "Уверены, что НДС к вычету собран корректно и нет разрывов по АСК НДС-2?",
    help: "Если вы не платите НДС — выберите последний вариант.",
    options: [
      { label: "Да, всё под контролем", risk: {} },
      { label: "Не уверен(а)", risk: { vat: 3, inspections: 1 } },
      { label: "Знаю, что есть проблемы / разрывы", risk: { vat: 4, inspections: 2, penalties: 1 } },
      { label: "Не платим НДС", risk: {} },
    ],
  },
  {
    id: "staff",
    title: "Сколько сотрудников в штате (зарплата, кадры)?",
    options: [
      { label: "Нет сотрудников", risk: {} },
      { label: "1–10", risk: { penalties: 1 } },
      { label: "10–50", risk: { penalties: 2, inspections: 1 } },
      { label: "Более 50", risk: { penalties: 3, inspections: 2 } },
    ],
  },
  {
    id: "calm",
    title: "Насколько спокойно вы себя чувствуете перед возможной проверкой ФНС?",
    options: [
      { label: "Спокоен(на), всё в порядке", risk: {} },
      { label: "Есть лёгкая тревога", risk: { inspections: 1 } },
      { label: "Честно — боюсь и не знаю, чего ждать", risk: { inspections: 2 } },
    ],
  },
];

const RECOMMENDATIONS: Record<CategoryKey, Record<Level, string>> = {
  vat: {
    low: "НДС под контролем. Поддерживайте регулярную сверку с контрагентами, чтобы не появлялись разрывы.",
    medium: "Есть зоны риска по НДС. Стоит проверить корректность вычетов и закрыть возможные разрывы по АСК НДС-2.",
    high: "Высокий риск по НДС: вероятны разрывы и доначисления. Нужна срочная проверка вычетов и сверка с контрагентами.",
  },
  profit: {
    low: "Учёт по налогу на прибыль в порядке. Контролируйте корректность расходов и первички.",
    medium: "Возможны ошибки в расчёте налога на прибыль. Рекомендуем аудит расходов и первичных документов.",
    high: "Высокий риск по налогу на прибыль: ошибки в расходах и первичке ведут к доначислениям. Нужен аудит.",
  },
  wed: {
    low: "Рисков по ВЭД почти нет. Если появятся импорт/экспорт — заранее настройте валютный контроль.",
    medium: "Есть операции ВЭД с зонами риска. Проверьте валютный контроль и таможенный НДС.",
    high: "Высокий риск по ВЭД: нарушения валютного законодательства дорого обходятся. Нужен контроль валютных операций и документов.",
  },
  inspections: {
    low: "Риск внимания ФНС низкий. Держите учёт «проверко-готовым».",
    medium: "Средний риск проверок. Подготовьте документы и регламент ответов на требования ФНС.",
    high: "Высокий риск проверок и требований ФНС. Нужна подготовка к камералкам и сопровождение.",
  },
  penalties: {
    low: "Риск штрафов и блокировок низкий. Продолжайте сдавать и платить вовремя.",
    medium: "Средний риск штрафов и блокировок. Наладьте контроль сроков сдачи и платежей.",
    high: "Высокий риск штрафов и блокировки счёта. Срочно нужен контроль сроков и корректности платежей.",
  },
};

export function levelFromScore(score: number): Level {
  if (score <= 33) return "low";
  if (score <= 66) return "medium";
  return "high";
}

/** Максимально возможный риск по категории (для нормализации в 0..100). */
function maxForCategory(key: CategoryKey): number {
  return QUESTIONS.reduce((sum, q) => {
    const maxOpt = Math.max(0, ...q.options.map((o) => o.risk[key] ?? 0));
    return sum + maxOpt;
  }, 0);
}

const CATEGORY_MAX: Record<CategoryKey, number> = {
  vat: maxForCategory("vat"),
  profit: maxForCategory("profit"),
  wed: maxForCategory("wed"),
  inspections: maxForCategory("inspections"),
  penalties: maxForCategory("penalties"),
};

export function scoreAudit(answers: Answers): AuditResult {
  const categories: CategoryResult[] = CATEGORIES.map(({ key, label, short }) => {
    let raw = 0;
    for (const q of QUESTIONS) {
      const idx = answers[q.id];
      if (idx === undefined) continue;
      const opt = q.options[idx];
      if (opt) raw += opt.risk[key] ?? 0;
    }
    const max = CATEGORY_MAX[key] || 1;
    const score = Math.round((raw / max) * 100);
    const level = levelFromScore(score);
    return { key, label, short, score, level, recommendation: RECOMMENDATIONS[key][level] };
  });

  const overall = Math.round(
    categories.reduce((s, c) => s + c.score, 0) / categories.length,
  );

  return { overall, level: levelFromScore(overall), categories };
}

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined);
}
