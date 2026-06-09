import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PricingForm from "@/components/PricingForm";

export const metadata = {
  title: "Расчёт стоимости бухгалтерского обслуживания — Юнивеж",
};

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-6">
          <PricingForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
