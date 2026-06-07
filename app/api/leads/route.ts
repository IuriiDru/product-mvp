import { prisma } from "@/lib/prisma";

const LEVELS = ["low", "medium", "high"];

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

    const lead = await prisma.lead.create({
      data: {
        name: String(name).slice(0, 200),
        phone: String(phone).slice(0, 50),
        company: company ? String(company).slice(0, 200) : null,
        comment: comment ? String(comment).slice(0, 1000) : null,
        overallScore: Number.isFinite(score) ? Math.round(score) : 0,
        riskLevel: LEVELS.includes(String(riskLevel)) ? String(riskLevel) : "low",
        answersJson: JSON.stringify(answers ?? {}),
        categoriesJson: JSON.stringify(categories ?? []),
      },
    });

    return Response.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("POST /api/leads failed:", e);
    return Response.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
