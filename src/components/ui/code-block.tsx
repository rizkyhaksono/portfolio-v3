import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { ExtraProps } from "react-markdown";
import CopyButton from "./copy-button";

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & ExtraProps;
type CodeProps = { className?: string; children?: ReactNode };

const langOf = (className?: string) => className?.match(/language-([\w+-]+)/)?.[1];

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<CodeProps>(node)) return textOf(node.props.children);
  return "";
}

/** Server specimen box: tint ground, Plex Mono, no syntax colours; the copy button is the only island. */
function Specimen({ text, lang, className }: Readonly<{ text: string; lang?: string; className?: string }>) {
  return (
    <div className="my-6 bg-tint">
      <div className="flex min-h-9 items-center justify-between gap-4 border-b border-rule px-4">
        <span className="font-display text-caption text-ink-soft">{lang}</span>
        <CopyButton text={text} lang={lang} />
      </div>
      <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[0.84375rem] leading-[1.55] text-ink">
        <code className={className}>{text}</code>
      </pre>
    </div>
  );
}

// react-markdown 9 no longer passes `inline`: inline code has no language class and no newline.
const CodeBlock = ({ className, children, node: _node, ...props }: CodeBlockProps) => {
  const code = String(children ?? "");

  if (!className?.includes("language-") && !code.includes("\n")) {
    return (
      <code className="bg-tint px-[0.3em] py-[0.1em] font-mono text-[0.85em]" {...props}>
        {children}
      </code>
    );
  }

  return <Specimen text={code.replace(/\n$/, "")} lang={langOf(className)} className={className} />;
};

/** MDX `pre`: prints the fenced `<code>` child as a specimen (the `code` mapping then only sees inline code). */
export function Pre({ children }: ComponentPropsWithoutRef<"pre">) {
  const { className, children: code } = isValidElement<CodeProps>(children) ? children.props : ({} as CodeProps);
  return <Specimen text={textOf(code).replace(/\n$/, "")} lang={langOf(className)} className={className} />;
}

export default CodeBlock;
