import { cn } from "@/lib/utils";
import React from "react";

const Typography = () => {
  return null;
};

const TypographyH1 = ({ children, className, ...props }: React.ComponentProps<"h1">) => {
  return (
    <h1 className={cn("scroll-m-20 font-display text-h1 text-balance", className)} {...props}>
      {children}
    </h1>
  );
};
Typography.H1 = TypographyH1;

const TypographyH2 = ({ children, className, ...props }: React.ComponentProps<"h2">) => {
  return (
    <h2 className={cn("scroll-m-20 border-b border-rule pb-2 font-display text-h2 text-balance first:mt-0", className)} {...props}>
      {children}
    </h2>
  );
};
Typography.H2 = TypographyH2;

const TypographyH3 = ({ children, className, ...props }: React.ComponentProps<"h3">) => {
  return (
    <h3 className={cn("mt-8 scroll-m-20 font-display text-h3", className)} {...props}>
      {children}
    </h3>
  );
};
Typography.H3 = TypographyH3;

const TypographyH4 = ({ children, className, ...props }: React.ComponentProps<"h4">) => {
  return (
    <h4 className={cn("scroll-m-20 font-display text-h4", className)} {...props}>
      {children}
    </h4>
  );
};
Typography.H4 = TypographyH4;

// Emphasis switches face (italic in roman text, roman inside italic headings) via globals.css, never colour.
const TypographyEm = ({ children, className, ...props }: React.ComponentProps<"em">) => {
  return (
    <em className={className} {...props}>
      {children}
    </em>
  );
};
Typography.Em = TypographyEm;

const TypographyP = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("text-body", className)} {...props}>
      {children}
    </div>
  );
};
Typography.P = TypographyP;

const TypographyBlockquote = ({ children, className, ...props }: React.ComponentProps<"blockquote">) => {
  return (
    <blockquote className={cn("mt-6 border-l border-ink pl-5 font-display text-lead", className)} {...props}>
      {children}
    </blockquote>
  );
};
Typography.quote = TypographyBlockquote;

export default Typography;
