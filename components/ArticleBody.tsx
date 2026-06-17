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
    <div className="text-[18px] leading-[1.7] text-[#222222]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "lead":
            return (
              <p key={i} className="my-4 text-[17px] italic text-sage">
                {renderInline(b.text)}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="mt-11 mb-3 text-2xl text-pine sm:text-[28px]">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-[26px] mb-2 text-[19px] text-pine">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="my-[13px]">
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="my-3 list-disc space-y-2 pl-6">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-3 list-decimal space-y-2 pl-6">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <div
                key={i}
                className="my-[18px] rounded-r-lg border-l-[3px] border-pine bg-cream px-[18px] py-3 italic text-[#2f4248]"
              >
                {renderInline(b.text)}
              </div>
            );
          case "callout":
            return (
              <div
                key={i}
                className="my-[18px] rounded-[10px] border border-pine/15 bg-pine/[0.055] px-[18px] py-[14px] text-[16px] leading-[1.55] text-pine-deep [&_strong]:!text-pine"
              >
                {renderInline(b.text)}
              </div>
            );
          case "compare":
            return (
              <div key={i} className="my-[18px] grid grid-cols-1 gap-[14px] sm:grid-cols-2">
                <div className="rounded-[10px] border border-risk-low/30 bg-risk-low/10 px-4 py-[14px] text-[15px] leading-[1.5]">
                  <h4 className="mb-2 text-[15px] font-semibold text-risk-low">{b.asset.title}</h4>
                  <ul className="list-disc space-y-1.5 pl-[18px]">
                    {b.asset.items.map((it, j) => (
                      <li key={j}>{renderInline(it)}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[10px] border border-risk-high/30 bg-risk-high/[0.08] px-4 py-[14px] text-[15px] leading-[1.5]">
                  <h4 className="mb-2 text-[15px] font-semibold text-risk-high">{b.cost.title}</h4>
                  <ul className="list-disc space-y-1.5 pl-[18px]">
                    {b.cost.items.map((it, j) => (
                      <li key={j}>{renderInline(it)}</li>
                    ))}
                  </ul>
                </div>
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
