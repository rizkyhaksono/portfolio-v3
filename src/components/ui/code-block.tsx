import type { ComponentPropsWithoutRef } from "react";
import type { ExtraProps } from "react-markdown";
import CopyButton from "./copy-button";

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & ExtraProps;

// react-markdown 9 no longer passes `inline`: inline code has no language class and no newline.
const CodeBlock = ({ className, children, node: _node, ...props }: CodeBlockProps) => {
  const code = String(children ?? "");

  if (!className?.includes("language-") && !code.includes("\n")) {
    return (
      <code className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props}>
        {children}
      </code>
    );
  }

  const text = code.replace(/\n$/, "");
  return (
    <div className="relative my-6">
      <pre className="overflow-x-auto rounded-none border bg-muted/50 p-5 pr-14 font-mono text-sm leading-relaxed">
        <code className={className} {...props}>
          {text}
        </code>
      </pre>
      <CopyButton text={text} />
    </div>
  );
};

export default CodeBlock;
