import { prisma } from "@/lib/prisma";
import { pricingSummary, type PricingAnswers } from "@/lib/pricing";

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface PricingEmailData {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  comment: string | null;
  answers: PricingAnswers;
}

// Письмо с заполненной анкетой расчёта стоимости (через Resend).
// Лучшее усилие: при сбое заявка всё равно сохранена в БД.
async function notifyByEmail(lead: PricingEmailData): Promise<void> {
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

  const sections = pricingSummary(lead.answers)
    .map(
      (s) =>
        `<tr><td colspan="2" style="padding:14px 0 4px;font-weight:bold;color:#173a2a">${esc(s.title)}</td></tr>` +
        s.items
          .map(
            (it) =>
              `<tr>
                <td style="padding:4px 14px 4px 0;color:#566256;vertical-align:top;width:55%">${esc(it.label)}</td>
                <td style="padding:4px 0;vertical-align:top"><b>${esc(it.value)}</b></td>
              </tr>`,
          )
          .join(""),
    )
    .join("");

  const subject = `Заявка на расчёт стоимости: ${lead.name}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#15241c;max-width:640px">
      <h2 style="color:#173a2a">Новая заявка на расчёт стоимости</h2>
      <table style="border-collapse:collapse;margin:8px 0 12px">
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Имя</td><td style="padding:4px 0"><b>${esc(lead.name)}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Телефон</td><td style="padding:4px 0"><b>${esc(lead.phone)}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Компания</td><td style="padding:4px 0">${esc(lead.company) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#566256">Комментарий</td><td style="padding:4px 0">${esc(lead.comment) || "—"}</td></tr>
      </table>
      <h3 style="color:#173a2a;margin-bottom:0">Анкета</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${sections}</table>
      <p style="margin-top:20px">
        <a href="${esc(appUrl)}/admin" style="background:#173a2a;color:#f6f1e6;padding:10px 18px;border-radius:100px;text-decoration:none">Открыть все заявки →</a>
      </p>
      <p style="color:#888;font-size:12px;margin-top:18px">Заявка №${esc(lead.id)} · анкета расчёта стоимости · сайт Юнивеж.</p>
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

    const { name, phone, comment, answers } = body as Record<string, unknown>;

    if (!name || !phone) {
      return Response.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    const safeAnswers: PricingAnswers =
      answers && typeof answers === "object"
        ? (answers as PricingAnswers)
        : {};
    const company =
      typeof safeAnswers.orgName === "string" && safeAnswers.orgName.trim()
        ? safeAnswers.orgName.trim().slice(0, 200)
        : null;

    const lead = await prisma.lead.create({
      data: {
        kind: "pricing",
        name: String(name).slice(0, 200),
        phone: String(phone).slice(0, 50),
        company,
        comment: comment ? String(comment).slice(0, 1000) : null,
        overallScore: 0,
        riskLevel: "low",
        answersJson: JSON.stringify(safeAnswers),
        categoriesJson: "[]",
      },
    });

    try {
      await notifyByEmail({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        company: lead.company,
        comment: lead.comment,
        answers: safeAnswers,
      });
    } catch (e) {
      console.error("Не удалось отправить письмо о заявке (pricing):", e);
    }

    return Response.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("POST /api/pricing failed:", e);
    return Response.json({ error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}
