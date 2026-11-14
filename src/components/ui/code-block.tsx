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

/**
 * Notion's code block, rendered on the server: the grey ground, the language in small muted text at the top left,
 * and a copy button at the top right that shows on hover or focus. System mono, no syntax colours.
 */
function Specimen({ text, lang, className }: Readonly<{ text: string; lang?: string; className?: string }>) {
  return (
    <div className="group/code relative my-6 rounded-md bg-muted">
      {lang && <span className="absolute left-4 top-2.5 text-caption text-muted-foreground">{lang}</span>}
      <div className="absolute right-2 top-1.5">
        <CopyButton text={text} lang={lang} />
      </div>
      {/* `!` padding: `.prose pre` would otherwise set its own and hide the code under the label row. */}
      <pre tabIndex={0} className="m-0 overflow-x-auto rounded-md bg-muted !px-4 !pb-4 !pt-10 font-mono text-[0.84375rem] leading-[1.55] text-foreground">
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
      <code className="rounded bg-tint-strong px-[0.35em] py-[0.15em] font-mono text-[0.85em]" {...props}>
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
