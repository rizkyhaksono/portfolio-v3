import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./code-block";
import Typography from "./typography";
import NextImage from "next/image";

interface MarkdownRendererProps {
  children: string;
}

interface TableProps {
  children: ReactNode;
}

const Table = ({ children }: TableProps) => (
  <div className="table-container">
    <table className="table w-full">{children}</table>
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
        p: (props) => <Typography.P {...props} />,
        h1: (props) => <Typography.H1 {...props} />,
        h2: (props) => <Typography.H2 {...props} />,
        h3: (props) => <Typography.H3 {...props} />,
        ul: (props) => (
          <ul className="list-disc space-y-3 pb-5 pl-10 font-sans" {...props} />
        ),
        ol: (props) => (
          <ol
            className="list-decimal space-y-3 pb-5 pl-10 font-sans"
            {...props}
          />
        ),
        img: (props) => (
          <NextImage
            className="rounded-xl mx-auto my-3"
            width={(props.width as number) || 1600}
            height={(props.height as number) || 1600}
            src={props.src as string}
            alt={props.alt as string}
            loading="lazy"
            quality={100}
          />
        ),
        code: (props) => <CodeBlock {...props} />,
        blockquote: (props) => <Typography.quote {...props} />,
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