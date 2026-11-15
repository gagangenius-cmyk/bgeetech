import type { ReactNode } from "react";

// Minimal, safe markdown subset: ## / ### headings, "- " lists, **bold**, [text](url). Output is React elements only.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++}>{m[1]}</strong>);
    else
      out.push(
        <a key={i++} href={m[3]} className="font-medium text-brand underline underline-offset-4" {...(m[3].startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {m[2]}
        </a>,
      );
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Prose({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed">
      {blocks.map((b, i) => {
        if (b.startsWith("### ")) return <h3 key={i} className="pt-4 font-display text-xl font-bold">{inline(b.slice(4))}</h3>;
        if (b.startsWith("## ")) return <h2 key={i} className="pt-6 font-display text-2xl font-bold tracking-tight">{inline(b.slice(3))}</h2>;
        if (b.split("\n").every((l) => l.trim().startsWith("- ")))
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {b.split("\n").map((l, j) => (
                <li key={j}>{inline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(b.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}
