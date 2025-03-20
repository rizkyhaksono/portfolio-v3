import { ArrowUpRight } from "lucide-react";
import Typography from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { cn } from "@/libs/utils";

const AuthCard = ({ className }: any) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/auth")}
      className={cn(
        "flex p-3 gap-3 items-center cursor-pointer transition-all dark:hover:bg-[#262626] hover:bg-[#D9D9D955] w-full text-left",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <Typography.P className="text-sm font-medium">Sign in</Typography.P>
        <Typography.P className="text-xs opacity-75">
          To access all features and personalization
        </Typography.P>
      </div>
      <ArrowUpRight className=" opacity-65" />
    </button>
  );
};

export default AuthCard;