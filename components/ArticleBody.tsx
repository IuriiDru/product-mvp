import Link from "next/link";
import type { Block } from "@/lib/blog/types";

// Разбирает простую инлайн-разметку в тексте: **полужирный** и
// внутренние ссылки [текст](/audit). Внешний HTML не поддерживается — безопасно.
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined && m[2] !== undefined) {
      nodes.push(
        <Link
          key={key++}
          href={m[2]}
          className="font-medium text-pine underline decoration-brass/40 underline-offset-2 transition hover:decoration-brass"
        >
          {m[1]}
        </Link>,
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-ink">
          {m[3]}
        </strong>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[17px] leading-relaxed text-ink-soft">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="mt-11 mb-3 text-2xl text-pine sm:text-[28px]">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 mb-2 text-xl text-pine">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="my-4">
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="my-4 list-disc space-y-2 pl-6 marker:text-brass">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brass">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <div
                key={i}
                className="my-6 rounded-2xl border-l-4 border-brass bg-paper-2 px-6 py-5 text-ink"
              >
                {renderInline(b.text)}
              </div>
            );
          case "cta":
            return (
              <div key={i} className="my-8">
                <Link
                  href={b.href}
                  className="inline-flex items-center gap-2 rounded-full bg-brass-bright px-7 py-4 text-base font-semibold text-pine-deep transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {b.label} <span aria-hidden>→</span>
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
