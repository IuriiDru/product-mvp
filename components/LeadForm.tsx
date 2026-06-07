"use client";

import { useState } from "react";
import { type AuditResult, type Answers } from "@/lib/audit";

interface Props {
  result: AuditResult;
  answers: Answers;
  onSuccess: () => void;
}

export default function LeadForm({ result, answers, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Укажите, пожалуйста, имя и телефон.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          company,
          comment,
          overallScore: result.overall,
          riskLevel: result.level,
          answers,
          categories: result.categories,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Не удалось отправить заявку.");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-pine/20 bg-paper px-4 py-3 text-base outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/15";

  return (
    <div className="mt-6 rounded-3xl bg-pine p-8 text-cream">
      <h3 className="font-display text-2xl text-cream">
        Получить бесплатный полный аудит
      </h3>
      <p className="mt-2 text-sm text-cream/70">
        Бухгалтер Юнивеж разберёт ваши риски детально и подскажет, как их закрыть.
        Перезвоним в течение рабочего дня.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="lf-name" className="mb-1.5 block text-sm font-medium text-cream/90">
            Как к вам обращаться *
          </label>
          <input
            id="lf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="lf-phone" className="mb-1.5 block text-sm font-medium text-cream/90">
            Телефон *
          </label>
          <input
            id="lf-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            className={inputClass}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="lf-company" className="mb-1.5 block text-sm font-medium text-cream/90">
            Компания / сфера
          </label>
          <input
            id="lf-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Напр.: оптовая торговля, ВЭД"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lf-comment" className="mb-1.5 block text-sm font-medium text-cream/90">
            Комментарий
          </label>
          <textarea
            id="lf-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Что вас беспокоит в первую очередь?"
            rows={3}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-risk-high/20 px-4 py-3 text-sm text-cream">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brass-bright px-6 py-4 text-base font-semibold text-pine-deep transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Отправляем…" : "Отправить заявку на аудит →"}
        </button>
        <p className="text-center text-xs text-cream/55">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </form>
    </div>
  );
}
