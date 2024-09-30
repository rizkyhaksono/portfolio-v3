import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./code-block";
import Typography from "./typography";

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
        p: (props) => <Typography.p {...props} />,
        h1: (props) => <Typography.h1 {...props} />,
        h2: (props) => <Typography.h2 {...props} />,
        h3: (props) => <Typography.h3 {...props} />,
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
          <img
            className="transition-all duration-700 ease-in-out hover:scale-105 rounded-xl my-8 align-middle"
            {...props}
            loading="lazy"
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