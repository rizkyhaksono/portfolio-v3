"use client";

import { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import Typography from "@/components/ui/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authLogout } from "@/services/visitor/auth";
import { removeCookie } from "@/app/actions/actions";
import { toast } from "sonner";
import { getProfile } from "@/services/user/profile";
import { useRouter } from "next/navigation";
import AuthCard from "./auth-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, LogOutIcon, User } from "lucide-react";
import Link from "next/link";

const ProfileSideCard = ({ avatarSize }: { avatarSize?: number }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const handleLogout = async () => {
    toast.promise(authLogout(), {
      loading: "Back to home...",
      success: async () => {
        await removeCookie("auth_session");
        return "Logged out successfully";
      },
      error: (err) => err,
      finally: () => router.refresh()
    })
  }

  if (!profile || profile?.name === "UNAUTHORIZED") return <AuthCard className="border rounded-xl" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full overflow-hidden">
        <div
          data-cy="auth-card-side"
          className={cn(
            `flex p-3 gap-3 items-center cursor-pointer border rounded-xl transition-all dark:hover:bg-[#262626] hover:bg-[#D9D9D955]"
            }`
          )}
        >
          <Avatar className="h-10 w-10">
            {profile?.data?.name && <AvatarFallback>{profile?.data?.name?.slice(0, 1)}</AvatarFallback>}
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography.P className="text-sm text-start font-medium text-ellipsis">
              {profile?.data?.name}
            </Typography.P>
            <Typography.P className="text-xs text-start opacity-75 text-ellipsis">
              {profile?.data?.email}
            </Typography.P>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem data-cy="profile-btn">
            <User size={16} className="mr-3" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        {profile?.isAdmin && (
          <Link href="/admin/dashboard">
            <DropdownMenuItem data-cy="admin-btn">
              <Home size={16} className="mr-3" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem data-cy="sign-out" onClick={() => handleLogout()}>
          <LogOutIcon size={16} className="mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSideCard;