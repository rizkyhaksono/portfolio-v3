import { cn } from "@/lib/utils";

/** Renders a stable formatted number without scheduling animation frames. */
export default function NumberTicker({
  value,
  className,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
}) {
  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className,
      )}
    >
      {Intl.NumberFormat("en-US").format(value)}
    </span>
  );
}
