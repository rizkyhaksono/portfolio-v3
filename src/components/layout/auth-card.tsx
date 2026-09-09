import { ArrowUpRight } from "lucide-react";
import Typography from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const AuthCard = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/auth")}
      className={cn(
        "flex h-9 items-center justify-between gap-3 px-3 text-left transition-colors hover:bg-secondary w-full",
        className
      )}
    >
      <Typography.P className="text-sm font-medium">Sign in</Typography.P>
      <ArrowUpRight className="h-4 w-4 opacity-65" />
    </button>
  );
};

export default AuthCard;
