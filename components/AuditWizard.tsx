"use client";

import { useState } from "react";
import {
  QUESTIONS,
  scoreAudit,
  type Answers,
  type AuditResult,
} from "@/lib/audit";
import RiskMap from "@/components/RiskMap";
import LeadForm from "@/components/LeadForm";

type Phase = "quiz" | "result" | "done";

export default function AuditWizard() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [result, setResult] = useState<AuditResult | null>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const selected = answers[question.id];
  const progress = Math.round((step / total) * 100);

  function choose(idx: number) {
    const next = { ...answers, [question.id]: idx };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setResult(scoreAudit(next));
      setPhase("result");
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setResult(null);
    setPhase("quiz");
  }

  // --- Экран благодарности ---
  if (phase === "done") {
    return (
      <div className="animate-fade-up rounded-3xl border border-pine/10 bg-paper-2 p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-risk-low text-3xl text-cream">
          ✓
        </div>
        <h2 className="mt-5 text-3xl">Заявка принята</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Бухгалтер Юнивеж свяжется с вами в течение рабочего дня и согласует
          удобное время для полного аудита.
        </p>
        <button
          onClick={restart}
          className="mt-7 rounded-full border border-pine/30 px-6 py-3 text-sm font-semibold transition hover:border-pine hover:bg-pine/5"
        >
          Пройти аудит заново
        </button>
      </div>
    );
  }

  // --- Экран результата ---
  if (phase === "result" && result) {
    return (
      <div>
        <RiskMap result={result} />
        <LeadForm
          result={result}
          answers={answers}
          onSuccess={() => setPhase("done")}
        />
        <div className="mt-6 text-center">
          <button
            onClick={restart}
            className="text-sm font-medium text-ink-soft underline-offset-4 transition hover:text-pine hover:underline"
          >
            Пройти аудит заново
          </button>
        </div>
      </div>
    );
  }

  // --- Опросник ---
  return (
    <div>
      {/* Прогресс */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
          <span>
            Вопрос {step + 1} из {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-pine/10">
          <div
            className="h-full rounded-full bg-brass transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Вопрос */}
      <div key={question.id} className="animate-fade-up">
        <h2 className="text-2xl sm:text-3xl">{question.title}</h2>
        {question.help && (
          <p className="mt-2 text-sm text-ink-soft">{question.help}</p>
        )}

        <div className="mt-6 space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                  isSelected
                    ? "border-pine bg-pine text-cream"
                    : "border-pine/15 bg-paper-2 hover:border-brass hover:bg-paper"
                }`}
              >
                <span
                  className={`grid h-6 w-6 flex-none place-items-center rounded-full border text-xs ${
                    isSelected
                      ? "border-cream text-cream"
                      : "border-pine/30 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="text-base">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-sm font-medium text-ink-soft transition hover:text-pine disabled:opacity-40"
          >
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}
