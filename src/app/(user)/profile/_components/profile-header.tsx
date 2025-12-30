"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Calendar, Shield, CheckCircle2, XCircle, Pencil, LogOut, Briefcase } from "lucide-react"
import { authLogout } from "@/services/visitor/auth"
import { removeCookie } from "@/app/actions/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ProfileData } from "@/commons/types/profile"
import { format } from "date-fns"

export default function ProfileHeader({ profile }: Readonly<{ profile: ProfileData }>) {
  const router = useRouter()

  const handleLogout = async () => {
    toast.promise(authLogout(), {
      loading: "Logging out...",
      success: async () => {
        await removeCookie("NATEE_V3_TOKEN")
        globalThis.window.location.href = "/auth"
        globalThis.window.location.reload()
        return "Logged out successfully"
      },
      error: (err) => err,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("")
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM yyyy")
    } catch {
      return "-"
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Banner/Cover Section */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
      </div>

      {/* Profile Content */}
      <CardContent className="relative px-6 pb-6">
        {/* Avatar - positioned to overlap banner */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={profile.iconUrl ?? profile.bannerUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt={profile.name} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 sm:mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
              {profile.isAdmin && (
                <Badge variant="default" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
              {profile.emailVerified ? (
                <Badge variant="secondary" className="gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400">
                  <XCircle className="h-3 w-3" />
                  Unverified
                </Badge>
              )}
            </div>
            {profile.headline && (
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {profile.headline}
              </p>
            )}
          </div>
        </div>

        {/* About Section */}
        {profile.about && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.about}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium truncate">{profile.location ?? "Not specified"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors sm:col-span-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 gap-2" onClick={() => router.push(`/profile/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-1 gap-2" variant="outline">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>Your session will be closed and you will be redirected to the login page.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
