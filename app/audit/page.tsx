import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuditWizard from "@/components/AuditWizard";

export const metadata = {
  title: "Экспресс-аудит налоговых рисков — Юнивеж",
};

export default function AuditPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-6">
          <AuditWizard />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
