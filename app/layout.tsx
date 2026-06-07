import type { Metadata } from "next";
import { Prata, Golos_Text } from "next/font/google";
import "./globals.css";

const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-prata",
  display: "swap",
});

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Юнивеж — Экспресс-аудит налоговых рисков",
  description:
    "Узнайте налоговые риски вашей компании за пару минут: пройдите экспресс-аудит и получите карту рисков с рекомендациями.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${prata.variable} ${golos.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
