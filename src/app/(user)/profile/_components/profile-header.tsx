"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Mail,
  MapPin,
} from 'lucide-react';
import { authLogout } from "@/services/visitor/auth"
import { removeCookie } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { ProfileData } from "@/commons/types/profile";

export default function ProfileHeader({ profile }: Readonly<{ profile: ProfileData }>) {
  const router = useRouter();

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.bannerUrl ?? "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"} alt={profile.email} />
          <AvatarFallback>{profile.name.split(" ").map((name) => name.charAt(0)).join("")}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription>{profile.about ?? "-"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 opacity-70" /> <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 opacity-70" /> <span>{profile.location ?? "-"}</span>
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full"
            size={"sm"}
            variant={"secondary"}
            onClick={() => router.push(`/profile/${profile.id}`)}
          >
            Edit Profile
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" size={"sm"} variant={"outline"}>Log Out</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your session will be closed and you will be redirected to the auth page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleLogout()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}