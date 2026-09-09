import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./code-block";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  children: string;
}

interface TableProps {
  children: ReactNode;
}

const Table = ({ children }: TableProps) => (
  <div className="my-4 w-full overflow-x-auto">
    <table className="w-full">{children}</table>
  </div>
);

const MDXComponent = ({ children }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ className, ...props }) => (
          <a
            className={cn(
              "cursor-pointer text-teal-600 hover:text-teal-400 hover:underline",
              className,
            )}
            target="_blank"
            {...props}
          />
        ),
        p: ({ className, ...props }) => (
          <p
            {...props}
            className={cn(
              "mb-6 text-[1.02rem] leading-8 text-foreground/85 sm:text-[1.08rem]",
              className,
            )}
          />
        ),
        h1: ({ className, ...props }) => (
          <h1
            {...props}
            className={cn(
              "mb-5 mt-12 scroll-m-24 font-display text-3xl font-semibold tracking-tight",
              className,
            )}
          />
        ),
        h2: ({ className, ...props }) => (
          <h2
            {...props}
            className={cn(
              "mb-4 mt-12 scroll-m-24 font-display text-2xl font-semibold tracking-tight",
              className,
            )}
          />
        ),
        h3: ({ className, ...props }) => (
          <h3
            {...props}
            className={cn(
              "mb-3 mt-10 scroll-m-24 font-display text-xl font-semibold tracking-tight",
              className,
            )}
          />
        ),
        ul: ({ className, ...props }) => (
          <ul
            {...props}
            className={cn(
              "mb-7 list-disc space-y-3 pl-6 text-[1.02rem] leading-8 text-foreground/85",
              className,
            )}
          />
        ),
        ol: ({ className, ...props }) => (
          <ol
            {...props}
            className={cn(
              "mb-7 list-decimal space-y-3 pl-6 text-[1.02rem] leading-8 text-foreground/85",
              className,
            )}
          />
        ),
        img: (props) => (
          <NextImage
            className="mx-auto my-8 border-y border-border"
            width={(props.width as number) || 1600}
            height={(props.height as number) || 1600}
            src={props.src as string}
            alt={props.alt as string}
            loading="lazy"
            quality={100}
          />
        ),
        code: (props) => <CodeBlock {...props} />,
        blockquote: ({ className, ...props }) => (
          <blockquote
            {...props}
            className={cn(
              "my-8 border-l-2 border-foreground pl-6 text-lg italic leading-8 text-muted-foreground",
              className,
            )}
          />
        ),
        table: (props) => <Table {...(props as TableProps)} />,
        th: (props) => (
          <th className="border border-border px-3 py-1 text-left">
            {props.children}
          </th>
        ),
        td: (props) => (
          <td className="border border-border px-3 py-1">
            {props.children}
          </td>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MDXComponent;
