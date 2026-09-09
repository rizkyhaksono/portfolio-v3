import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./code-block";
import NextImage from "next/image";

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
        a: (props) => (
          <a
            className="cursor-pointer text-teal-600 hover:text-teal-400 hover:underline"
            target="_blank"
            {...props}
          />
        ),
        p: (props) => <p className="mb-6 text-[1.02rem] leading-8 text-foreground/85 sm:text-[1.08rem]" {...props} />,
        h1: (props) => <h1 className="mb-5 mt-12 scroll-m-24 font-display text-3xl font-semibold tracking-tight" {...props} />,
        h2: (props) => <h2 className="mb-4 mt-12 scroll-m-24 font-display text-2xl font-semibold tracking-tight" {...props} />,
        h3: (props) => <h3 className="mb-3 mt-10 scroll-m-24 font-display text-xl font-semibold tracking-tight" {...props} />,
        ul: (props) => (
          <ul className="mb-7 list-disc space-y-3 pl-6 text-[1.02rem] leading-8 text-foreground/85" {...props} />
        ),
        ol: (props) => (
          <ol
            className="mb-7 list-decimal space-y-3 pl-6 text-[1.02rem] leading-8 text-foreground/85"
            {...props}
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
        blockquote: (props) => <blockquote className="my-8 border-l-2 border-foreground pl-6 text-lg italic leading-8 text-muted-foreground" {...props} />,
        table: (props) => <Table {...(props as TableProps)} />,
        th: (props) => (
          <th className="border px-3 py-1 text-left dark:border-neutral-600">
            {props.children}
          </th>
        ),
        td: (props) => (
          <td className="border px-3  py-1 dark:border-neutral-600">
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
