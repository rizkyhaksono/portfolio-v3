'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Code, Terminal } from 'lucide-react';

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

export const Pre = ({ children, ...props }: PreProps) => {
  const [copied, setCopied] = React.useState(false);

  // Extract text content from children
  const getCodeContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getCodeContent).join('');
    if (React.isValidElement(node)) {
      const element = node as any;
      if (element.props?.children) return getCodeContent(element.props.children);
    }
    return '';
  };

  const codeContent = getCodeContent(children);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <pre
        className={cn(
          'rounded-lg border bg-muted/50 p-4 overflow-x-auto',
          'text-sm leading-relaxed',
          'font-mono'
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-md',
          'bg-muted hover:bg-muted/80 transition-colors',
          'opacity-0 group-hover:opacity-100',
          'flex items-center gap-1 text-xs'
        )}
        title="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
};

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  // Check if this is a code block (has language class) or inline code
  const isCodeBlock = className?.includes('language-');

  // Extract language from className
  const languageMatch = className?.match(/language-(\w+)/);
  const language = languageMatch ? languageMatch[1] : null;

  if (!isCodeBlock) {
    return (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem]',
          'text-sm font-mono font-semibold',
          'border',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  const getLanguageIcon = () => {
    switch (language?.toLowerCase()) {
      case 'tsx':
      case 'jsx':
        return <Code className="h-4 w-4" />;
      case 'bash':
      case 'shell':
      case 'sh':
        return <Terminal className="h-4 w-4" />;
      case 'python':
        return <Code className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative my-6">
      {language && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted border border-b-0 rounded-t-lg">
          {getLanguageIcon()}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {language}
          </span>
        </div>
      )}
      <code
        className={cn(
          'block text-sm leading-relaxed',
          'font-mono',
          language && 'rounded-b-lg border border-t-0 p-4 bg-muted/50 overflow-x-auto block',
          !language && 'rounded-lg border p-4 bg-muted/50 overflow-x-auto',
          className
        )}
        {...props}
      >
        {children}
      </code>
    </div>
  );
};
