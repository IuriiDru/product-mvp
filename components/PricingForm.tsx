"use client";

import { useState } from "react";
import { PRICING_SCHEMA, type PricingAnswers } from "@/lib/pricing";
import { ymGoal } from "@/lib/metrika";

export default function PricingForm() {
  const [answers, setAnswers] = useState<PricingAnswers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Укажите, пожалуйста, имя и телефон для связи.");
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, name, phone, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Не удалось отправить заявку.");
      }
      ymGoal("lead_pricing");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-pine/20 bg-paper px-4 py-3 text-base outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/15";

  if (done) {
    return (
      <div className="animate-fade-up rounded-3xl border border-pine/10 bg-paper-2 p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-risk-low text-3xl text-cream">
          ✓
        </div>
        <h2 className="mt-5 text-3xl">Анкета отправлена</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Спасибо! Мы изучим ваши данные и подготовим персональный расчёт стоимости.
          Бухгалтер Юнивеж свяжется с вами в течение рабочего дня.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="text-3xl sm:text-4xl">Расчёт стоимости обслуживания</h1>
        <p className="mt-3 text-ink-soft">
          Заполните анкету — чем точнее данные, тем точнее расчёт. Стоимость мы
          пришлём индивидуально после анализа: универсальной «цены с калькулятора»
          в бухгалтерии не бывает. Обязательны только имя и телефон.
        </p>
      </div>

      {PRICING_SCHEMA.map((field) => {
        if (field.kind === "section") {
          return (
            <h2
              key={field.id}
              className="border-b border-pine/15 pb-2 pt-4 font-display text-2xl text-pine"
            >
              {field.title}
            </h2>
          );
        }

        if (field.kind === "text") {
          return (
            <div key={field.id}>
              <label className="mb-1.5 block text-sm font-medium">{field.title}</label>
              <input
                value={answers[field.id] || ""}
                onChange={(e) => set(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          );
        }

        if (field.kind === "pair") {
          return (
            <div key={field.id}>
              <label className="mb-1.5 block text-sm font-medium">{field.title}</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={answers[`${field.id}__now`] || ""}
                  onChange={(e) => set(`${field.id}__now`, e.target.value)}
                  placeholder={field.nowLabel}
                  inputMode="numeric"
                  className={inputClass}
                />
                <input
                  value={answers[`${field.id}__plan`] || ""}
                  onChange={(e) => set(`${field.id}__plan`, e.target.value)}
                  placeholder={field.planLabel}
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>
            </div>
          );
        }

        // single
        const selected = answers[field.id];
        const showNote =
          field.note && selected && selected.includes(field.note.whenLabelIncludes);
        return (
          <div key={field.id}>
            <label className="mb-2 block text-sm font-medium">{field.title}</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {field.options.map((opt) => {
                const isSel = selected === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => set(field.id, opt)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      isSel
                        ? "border-pine bg-pine text-cream"
                        : "border-pine/15 bg-paper-2 hover:border-brass hover:bg-paper"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 flex-none place-items-center rounded-full border text-[10px] ${
                        isSel ? "border-cream text-cream" : "border-pine/30 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {showNote && field.note && (
              <input
                value={answers[`${field.id}__note`] || ""}
                onChange={(e) => set(`${field.id}__note`, e.target.value)}
                placeholder={field.note.placeholder}
                className={`${inputClass} mt-2`}
              />
            )}
          </div>
        );
      })}

      {/* Контакты */}
      <div className="rounded-3xl bg-pine p-8 text-cream">
        <h2 className="font-display text-2xl text-cream">Куда прислать расчёт</h2>
        <p className="mt-2 text-sm text-cream/70">
          Перезвоним в течение рабочего дня и пришлём персональную стоимость.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium text-cream/90">
              Как к вам обращаться *
            </label>
            <input
              id="pf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="pf-phone" className="mb-1.5 block text-sm font-medium text-cream/90">
              Телефон *
            </label>
            <input
              id="pf-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className={inputClass}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="pf-comment" className="mb-1.5 block text-sm font-medium text-cream/90">
              Комментарий
            </label>
            <textarea
              id="pf-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Что важно учесть?"
              rows={3}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-risk-high/20 px-4 py-3 text-sm text-cream">{error}</p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-xs text-cream/70">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brass-bright"
            />
            <span>
              Я согласен(а) на обработку персональных данных в соответствии с{" "}
              <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-cream">
                Политикой обработки ПДн
              </a>{" "}
              и даю{" "}
              <a href="/consent" target="_blank" rel="noopener" className="underline hover:text-cream">
                Согласие на обработку ПДн
              </a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !consent}
            className="w-full rounded-full bg-brass-bright px-6 py-4 text-base font-semibold text-pine-deep transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Отправляем…" : "Отправить анкету →"}
          </button>
        </div>
      </div>
    </form>
  );
}
