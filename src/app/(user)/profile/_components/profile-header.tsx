"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mail, MapPin, Calendar, Shield, CheckCircle2, XCircle, Pencil, LogOut, Briefcase, Link2, User } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa"
import { authLogout } from "@/services/visitor/auth"
import { removeCookie } from "@/app/actions/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ProfileData } from "@/commons/types/profile"
import { format } from "date-fns"
import Image from "next/image"

export default function ProfileHeader({ profile }: Readonly<{ profile: ProfileData }>) {
  console.log("Profile Data:", profile)
  const router = useRouter()

  const getOAuthIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return <FcGoogle className="h-4 w-4" />
      case "github":
        return <FaGithub className="h-4 w-4" />
      case "discord":
        return <FaDiscord className="h-4 w-4 text-[#5865F2]" />
      case "facebook":
        return <FaFacebook className="h-4 w-4 text-[#1877F2]" />
      default:
        return <Link2 className="h-4 w-4" />
    }
  }

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase()
  }

  const handleLogout = async () => {
    try {
      await removeCookie("NATEE_V3_TOKEN")

      // Clear any local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("chat_user")
      }

      toast.success("Logged out successfully")

      // Redirect to auth page
      window.location.href = "/auth"
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
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
    <Card className="overflow-hidden border-2">
      {/* Banner/Cover Section */}
      <div className="relative h-40 bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        {profile.bannerUrl && <Image src={profile.bannerUrl} alt="Profile banner" fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
      </div>

      {/* Profile Content */}
      <CardContent className="relative px-6 pb-6">
        {/* Avatar - positioned to overlap banner */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-28 w-28 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                  {profile.iconUrl || profile.avatarUrl ? <AvatarImage src={profile.iconUrl || profile.avatarUrl || ""} alt={profile.name} /> : null}
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-secondary/20">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile Picture</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 sm:mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
              {profile.isAdmin && (
                <Badge variant="default" className="gap-1 shadow-sm">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
              {profile.emailVerified ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1 text-green-600 dark:text-green-400 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email has been verified</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400">
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email verification pending</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {profile.headline ? (
              <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-base">
                <Briefcase className="h-4 w-4" />
                {profile.headline}
              </p>
            ) : (
              <p className="text-muted-foreground/60 mt-2 flex items-center gap-1.5 text-sm italic">
                <User className="h-4 w-4" />
                No headline set
              </p>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6">
          {profile.about ? <p className="text-sm text-muted-foreground leading-relaxed">{profile.about}</p> : <p className="text-sm text-muted-foreground/60 italic">No bio added yet. Click &quot;Edit Profile&quot; to add one.</p>}
        </div>

        <Separator className="my-6" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all hover:shadow-sm">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Email</p>
              <p className="text-sm font-medium truncate">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all hover:shadow-sm">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Location</p>
              <p className="text-sm font-medium truncate">{profile.location || <span className="text-muted-foreground/60 italic">Not specified</span>}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all hover:shadow-sm">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Member Since</p>
              <p className="text-sm font-medium">{formatDate(profile.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all hover:shadow-sm">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Account Type</p>
              <p className="text-sm font-medium">{profile.role || "USER"}</p>
            </div>
          </div>
        </div>

        {/* OAuth Accounts Section */}
        {profile.oauthAccounts && profile.oauthAccounts.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Connected Accounts
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.oauthAccounts.map((account, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="gap-2 py-1.5 px-3 hover:bg-muted/50 transition-colors">
                          {getOAuthIcon(account.provider)}
                          <span className="font-medium">{getProviderName(account.provider)}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Connected via {getProviderName(account.provider)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 gap-2 shadow-sm" size="lg" onClick={() => router.push(`/profile/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-1 gap-2 shadow-sm" size="lg" variant="outline">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>Your session will be closed and you will be redirected to the login page. Any unsaved changes will be lost.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
