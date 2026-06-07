import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { LEVEL_LABEL, type Level } from "@/lib/audit";

export const dynamic = "force-dynamic";

const levelBadge: Record<Level, string> = {
  low: "bg-risk-low/15 text-risk-low",
  medium: "bg-risk-medium/15 text-risk-medium",
  high: "bg-risk-high/15 text-risk-high",
};

function normalizeLevel(value: string): Level {
  return value === "high" || value === "medium" ? value : "low";
}

export default async function AdminPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-3xl">Заявки на аудит</h1>
            <span className="text-sm text-ink-soft">Всего: {leads.length}</span>
          </div>

          {leads.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-pine/20 bg-paper-2 p-12 text-center text-ink-soft">
              Заявок пока нет. Пройдите{" "}
              <a href="/audit" className="font-medium text-pine underline underline-offset-4">
                экспресс-аудит
              </a>{" "}
              и оставьте заявку — она появится здесь.
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-pine/10 bg-paper-2">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-pine/10 text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Дата</th>
                    <th className="px-5 py-4 font-semibold">Имя</th>
                    <th className="px-5 py-4 font-semibold">Телефон</th>
                    <th className="px-5 py-4 font-semibold">Компания</th>
                    <th className="px-5 py-4 font-semibold">Риск</th>
                    <th className="px-5 py-4 font-semibold">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const level = normalizeLevel(lead.riskLevel);
                    return (
                      <tr key={lead.id} className="border-b border-pine/5 align-top">
                        <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                          {new Date(lead.createdAt).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-5 py-4 font-medium">{lead.name}</td>
                        <td className="whitespace-nowrap px-5 py-4">{lead.phone}</td>
                        <td className="px-5 py-4">{lead.company || "—"}</td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${levelBadge[level]}`}
                          >
                            {LEVEL_LABEL[level]} · {lead.overallScore}
                          </span>
                        </td>
                        <td className="max-w-xs px-5 py-4 text-ink-soft">
                          {lead.comment || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
