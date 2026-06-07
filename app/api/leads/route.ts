import { prisma } from "@/lib/prisma";
import { LEVEL_LABEL, type CategoryResult } from "@/lib/audit";

const LEVELS = ["low", "medium", "high"];

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function levelLabel(level: string): string {
  return level === "high" || level === "medium" || level === "low"
    ? LEVEL_LABEL[level]
    : level;
}

interface LeadEmailData {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  comment: string | null;
  overallScore: number;
  riskLevel: string;
  categories: CategoryResult[];
}

// Отправка уведомления о новой заявке через Resend (https://resend.com).
// Лучшее усилие: если ключ не задан или сервис недоступен — заявка всё равно
// сохранена в базе, ошибка только логируется и не ломает ответ пользователю.
async function notifyByEmail(lead: LeadEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY не задан — письмо о заявке не отправлено.");
    return;
  }

  const to = process.env.LEAD_NOTIFY_TO || "kobzeva@univeige.ru";
  const from =
    process.env.LEAD_NOTIFY_FROM || "Юнивеж · Аудит <onboarding@resend.dev>";
  const appUrl =
    process.env.APP_URL || "https://product-mvp-production-4640.up.railway.app";

  const rows = lead.categories
    .map(
      (c) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(c.label)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${esc(c.score)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(levelLabel(c.level))}</td>
        </tr>`,
    )
    .join("");

  const subject = `Новая заявка на аудит: ${lead.name} — риск ${levelLabel(
    lead.riskLevel,
  )} (${lead.overallScore})`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#15241c;max-width:560px">
      <h2 style="color:#173a2a">Новая заявка на экспресс-аудит</h2>
      <table style="border-collapse:collapse;margin:8px 0 18px">
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Имя</td><td style="padding:4px 0"><b>${esc(lead.name)}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Телефон</td><td style="padding:4px 0"><b>${esc(lead.phone)}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Компания</td><td style="padding:4px 0">${esc(lead.company) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Комментарий</td><td style="padding:4px 0">${esc(lead.comment) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Общий риск</td><td style="padding:4px 0"><b>${esc(levelLabel(lead.riskLevel))}</b> · ${esc(lead.overallScore)}/100</td></tr>
      </table>
      <h3 style="color:#173a2a;margin-bottom:6px">Карта рисков</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <thead>
          <tr style="text-align:left;color:#566256">
            <th style="padding:6px 12px;border-bottom:2px solid #173a2a">Категория</th>
            <th style="padding:6px 12px;border-bottom:2px solid #173a2a;text-align:center">Балл</th>
            <th style="padding:6px 12px;border-bottom:2px solid #173a2a">Уровень</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:20px">
        <a href="${esc(appUrl)}/admin" style="background:#173a2a;color:#f6f1e6;padding:10px 18px;border-radius:100px;text-decoration:none">Открыть все заявки →</a>
      </p>
      <p style="color:#888;font-size:12px;margin-top:18px">Заявка №${esc(lead.id)} · отправлено автоматически с сайта Юнивеж.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("Resend вернул ошибку:", res.status, await res.text());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: "Некорректный запрос" }, { status: 400 });
    }

    const { name, phone, company, comment, overallScore, riskLevel, answers, categories } =
      body as Record<string, unknown>;

    if (!name || !phone) {
      return Response.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 },
      );
    }

    const score = Number(overallScore);
    const safeCategories = Array.isArray(categories)
      ? (categories as CategoryResult[])
      : [];

    const lead = await prisma.lead.create({
      data: {
        name: String(name).slice(0, 200),
        phone: String(phone).slice(0, 50),
        company: company ? String(company).slice(0, 200) : null,
        comment: comment ? String(comment).slice(0, 1000) : null,
        overallScore: Number.isFinite(score) ? Math.round(score) : 0,
        riskLevel: LEVELS.includes(String(riskLevel)) ? String(riskLevel) : "low",
        answersJson: JSON.stringify(answers ?? {}),
        categoriesJson: JSON.stringify(safeCategories),
      },
    });

    // Уведомление на почту — не блокирует успешный ответ при сбое отправки.
    try {
      await notifyByEmail({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        company: lead.company,
        comment: lead.comment,
        overallScore: lead.overallScore,
        riskLevel: lead.riskLevel,
        categories: safeCategories,
      });
    } catch (e) {
      console.error("Не удалось отправить письмо о заявке:", e);
    }

    return Response.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("POST /api/leads failed:", e);
    return Response.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
