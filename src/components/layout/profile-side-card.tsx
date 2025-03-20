
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import Typography from "@/components/ui/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { authSignOut } from "@/services/auth";
import { toast } from "sonner";
import { getProfile } from "@/services/user/profile";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
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
import Image from "next/image";
import Link from "next/link";

const ProfileSideCard = ({ avatarSize }: { avatarSize?: number }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);
  
  // const handleLogout = () => {
  //   toast.promise(authSignOut(), {
  //     loading: "Turning back to home from Eden...",
  //     success: () => {
  //       setProfile(null);
  //       return "Successfull logged out";
  //     },
  //     error: (err) => err,
  //     finally: () => router.refresh(),
  //   });
  // };

  // if (loading)
  //   return (
  //     <div className="flex p-3 w-full gap-3 items-center cursor-pointer border rounded-xl transition-all">
  //       <Skeleton className="h-10 w-10 rounded-full" />
  //       <div className="flex flex-col gap-1">
  //         <Skeleton className="h-4 w-28" />
  //         <Skeleton className="h-4 w-2/5" />
  //       </div>
  //     </div>
  //   );

  if (!profile || profile.name === "UNAUTHORIZED") return <AuthCard className="border rounded-xl" />;

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
            {profile?.data.iconUrl !== null ? (
              <Image
                fill={true}
                sizes="(max-width: 68px) 100vw, (max-width: 68px) 50vw, 33vw"
                className="h-full w-full transform object-cover"
                alt={profile?.name}
                src={profile?.iconUrl}
              />
            ) : (
              <AvatarFallback>{profile?.data.name.slice(0, 1)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography.P className="text-sm text-start font-medium text-ellipsis">
              {profile?.data.name}
            </Typography.P>
            <Typography.P className="text-xs text-start opacity-75 text-ellipsis">
              {profile?.data.email}
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
        {/* <DropdownMenuItem data-cy="sign-out" onClick={() => handleLogout()}>
          <LogOutIcon size={16} className="mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSideCard;