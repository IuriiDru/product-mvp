// Анкета «Расчёт стоимости бухгалтерского обслуживания».
// Структура взята из рабочего файла «Анкета на услугу бухгалтерского обслуживания.xlsx».
// Клиенту цена НЕ показывается — заполненная анкета уходит заявкой на почту.

export interface SingleNote {
  /** Если выбранный вариант содержит эту подстроку — показать поле для уточнения. */
  whenLabelIncludes: string;
  placeholder: string;
}

export type PricingField =
  | { kind: "section"; id: string; title: string }
  | { kind: "text"; id: string; title: string; placeholder?: string; help?: string }
  | {
      kind: "single";
      id: string;
      title: string;
      options: string[];
      note?: SingleNote;
      help?: string;
    }
  | {
      kind: "pair";
      id: string;
      title: string;
      nowLabel: string;
      planLabel: string;
      help?: string;
    };

export const PRICING_SCHEMA: PricingField[] = [
  { kind: "section", id: "s1", title: "1. Общие вопросы" },
  {
    kind: "text",
    id: "orgName",
    title: "Наименование компании (ИП) и ИНН",
    placeholder: "Напр.: ООО «Ромашка», ИНН 7700000000",
  },
  {
    kind: "single",
    id: "orgForm",
    title: "Организационно-правовая форма",
    options: ["ООО", "ЗАО", "ОАО", "ИП"],
  },

  { kind: "section", id: "s2", title: "2. Специфика деятельности" },
  {
    kind: "single",
    id: "activity",
    title: "Вид деятельности",
    options: [
      "Производство",
      "Производственные услуги",
      "Оптовая торговля",
      "Розничная торговля",
      "Дистрибуция, логистика",
      "Транспорт, перевозки",
      "Строительство",
      "Общественное питание",
      "Услуги (консалтинг, дизайн и т.п.)",
      "Медицинские услуги",
      "Финансовые услуги",
      "Иное (указать)",
    ],
    note: { whenLabelIncludes: "Иное", placeholder: "Уточните вид деятельности" },
  },
  {
    kind: "single",
    id: "foreign",
    title: "Внешнеэкономическая деятельность",
    options: ["Не ведётся", "Экспорт", "Импорт"],
  },

  { kind: "section", id: "s3", title: "3. Масштаб деятельности" },
  {
    kind: "single",
    id: "subdivisions",
    title: "Наличие обособленных подразделений",
    options: ["Отсутствуют", "Есть обособленные подразделения"],
    note: { whenLabelIncludes: "Есть", placeholder: "Количество подразделений" },
  },
  {
    kind: "single",
    id: "foreignSub",
    title: "ВЭД обособленного подразделения",
    options: [
      "Не ведётся",
      "Ведётся: Экспорт",
      "Ведётся: Импорт",
      "Планируется через год: Экспорт",
      "Планируется через год: Импорт",
    ],
  },
  {
    kind: "pair",
    id: "revenue",
    title: "Величина ежеквартальной выручки, тыс. руб.",
    nowLabel: "на текущий момент",
    planLabel: "планируется через год",
  },
  {
    kind: "pair",
    id: "goods",
    title: "Количество номенклатуры товаров, шт./тыс. шт.",
    nowLabel: "на текущий момент",
    planLabel: "планируется через год",
  },
  {
    kind: "pair",
    id: "materials",
    title: "Количество номенклатуры сырья / материалов / деталей",
    nowLabel: "на текущий момент",
    planLabel: "планируется через год",
  },

  { kind: "section", id: "s4", title: "4. Объём учётной документации" },
  {
    kind: "pair",
    id: "bankDocs",
    title: "Банковских выписок в месяц",
    nowLabel: "на текущую дату",
    planLabel: "планируется через год",
  },
  {
    kind: "pair",
    id: "salesDocs",
    title: "Документов по реализации в месяц (акты, накладные, счета-фактуры)",
    nowLabel: "на текущую дату",
    planLabel: "планируется через год",
  },
  {
    kind: "pair",
    id: "purchaseDocs",
    title: "Документов по закупкам в месяц (акты, накладные, счета-фактуры)",
    nowLabel: "на текущую дату",
    planLabel: "планируется через год",
  },

  { kind: "section", id: "s5", title: "5. Особенности налогового учёта" },
  {
    kind: "single",
    id: "taxSystem",
    title: "Система налогообложения",
    options: [
      "Общая система (ОСНО)",
      "УСН «Доходы»",
      "УСН «Доходы минус Расходы»",
      "Совмещение режимов (указать)",
    ],
    note: { whenLabelIncludes: "Совмещение", placeholder: "Какие режимы совмещаете" },
  },
  {
    kind: "single",
    id: "vatSeparate",
    title: "Раздельный учёт НДС (применение разных ставок)",
    options: ["Не ведётся", "Ведётся"],
  },
  {
    kind: "single",
    id: "pbu18",
    title: "Применение ПБУ 18/02 «Учёт расчётов по налогу на прибыль»",
    options: ["Не применяется", "Применяется"],
  },

  { kind: "section", id: "s6", title: "6. Требования к ведению учёта" },
  {
    kind: "single",
    id: "primaryDocs",
    title: "Требуется ли создавать первично-учётную документацию?",
    options: ["Не требуется (использование загрузки данных)", "Требуется"],
  },
  {
    kind: "single",
    id: "restore",
    title: "Требуется ли восстановление учёта за прошлые периоды?",
    options: ["Не требуется", "Требуется (указать периоды)"],
    note: { whenLabelIncludes: "указать периоды", placeholder: "Какие периоды восстановить" },
  },
  {
    kind: "single",
    id: "bankClientNeed",
    title: "Требуется ли ведение банк-клиента?",
    options: ["Не требуется", "Требуется"],
  },

  { kind: "section", id: "s7", title: "7. Особенности кадрового учёта" },
  {
    kind: "single",
    id: "hrNeed",
    title: "Потребность в кадровом учёте",
    options: ["Не требуется", "Требуется"],
  },
  {
    kind: "pair",
    id: "headcount",
    title: "Среднесписочная численность персонала, чел.",
    nowLabel: "за последний год",
    planLabel: "план на год",
  },
  {
    kind: "pair",
    id: "turnover",
    title: "Текучесть кадров",
    nowLabel: "за последний год",
    planLabel: "план на год",
  },

  { kind: "section", id: "s8", title: "8. Технические особенности" },
  {
    kind: "single",
    id: "software",
    title: "Какое ПО используется для учёта?",
    options: [
      "1С: Бухгалтерия 7.7",
      "1С: Торговля и склад 7.7",
      "1С: Зарплата и кадры 7.7",
      "1С: Бухгалтерия 8",
      "1С: Управление торговлей 8",
      "1С: Управление производственным предприятием 8",
      "1С: Упрощёнка 8",
      "1С: Розница 8",
      "1С: Зарплата и управление персоналом 8",
      "Не применяется ПО",
      "Иной программный продукт",
    ],
    note: { whenLabelIncludes: "Иной", placeholder: "Укажите программу" },
  },
];

export type PricingAnswers = Record<string, string>;

export interface PricingSummarySection {
  title: string;
  items: { label: string; value: string }[];
}

/** Группирует ответы по разделам — для письма и хранения (порядок задаёт схема). */
export function pricingSummary(answers: PricingAnswers): PricingSummarySection[] {
  const sections: PricingSummarySection[] = [];
  let current: PricingSummarySection | null = null;

  for (const field of PRICING_SCHEMA) {
    if (field.kind === "section") {
      current = { title: field.title, items: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;

    if (field.kind === "text") {
      current.items.push({ label: field.title, value: (answers[field.id] || "").trim() || "—" });
    } else if (field.kind === "single") {
      let value = (answers[field.id] || "").trim() || "—";
      const note = (answers[`${field.id}__note`] || "").trim();
      if (note) value += ` (${note})`;
      current.items.push({ label: field.title, value });
    } else if (field.kind === "pair") {
      const now = (answers[`${field.id}__now`] || "").trim();
      const plan = (answers[`${field.id}__plan`] || "").trim();
      if (!now && !plan) {
        current.items.push({ label: field.title, value: "—" });
      } else {
        current.items.push({
          label: field.title,
          value: `${field.nowLabel}: ${now || "—"}; ${field.planLabel}: ${plan || "—"}`,
        });
      }
    }
  }
  return sections;
}
