interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

/** Compatibility wrapper retained while rendering content without runtime animation. */
export default function BlurFade({ children, className }: BlurFadeProps) {
  return <div className={className}>{children}</div>;
}
