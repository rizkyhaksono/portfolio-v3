"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { User, Bell, Shield, Palette, Globe, Save, Loader2, Moon, Sun, Monitor, Camera, LogOut, Mail, CalendarDays, BadgeCheck, Fingerprint } from "lucide-react"
import {
  getCurrentUserClient,
  getAdminSettingsClient,
  updateAdminSettingsClient,
  updateUserClient,
  uploadAvatarClient,
} from "@/services/admin/client-services"
import { performAdminLogout } from "@/lib/admin-logout"
import { useTheme } from "next-themes"

// Profile settings schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().max(100).optional(),
})

// Notification settings schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  projectUpdates: z.boolean(),
  securityAlerts: z.boolean(),
})

// Appearance settings schema
const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string(),
  timezone: z.string(),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type NotificationFormValues = z.infer<typeof notificationSchema>
type AppearanceFormValues = z.infer<typeof appearanceSchema>

interface OAuthAccount {
  provider?: string
  providerId?: string
  providerUserId?: string
}

interface UserData {
  id: string
  name: string
  email: string
  about?: string
  location?: string
  image?: string
  avatarUrl?: string
  role?: string
  createdAt?: string
  emailVerified?: boolean
  oauthAccounts?: OAuthAccount[]
}

export default function AdminDashboardSettingPage() {
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      website: "",
      location: "",
    },
  })

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      projectUpdates: true,
      securityAlerts: true,
    },
  })

  // Appearance form
  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "system",
      language: "en",
      timezone: "UTC",
    },
  })

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true)
      try {
        const [userData, settings] = await Promise.all([
          getCurrentUserClient(),
          getAdminSettingsClient().catch(() => null),
        ])
        if (userData) {
          setUser(userData)
          profileForm.reset({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.about || "",
            website: settings?.website || "",
            location: userData.location || "",
          })
        }
        if (settings) {
          notificationForm.reset({
            emailNotifications: settings.emailNotifications,
            pushNotifications: settings.pushNotifications,
            weeklyDigest: settings.weeklyDigest,
            projectUpdates: settings.projectUpdates,
            securityAlerts: settings.securityAlerts,
          })
          appearanceForm.reset({
            theme: (settings.theme as "light" | "dark" | "system") || "system",
            language: settings.language || "en",
            timezone: settings.timezone || "UTC",
          })
          if (settings.theme === "light" || settings.theme === "dark" || settings.theme === "system") {
            setTheme(settings.theme)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [profileForm, notificationForm, appearanceForm, setTheme])

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user?.id) return
    setIsSaving(true)
    try {
      await updateUserClient(user.id, {
        name: data.name,
        email: data.email,
        about: data.bio,
        location: data.location,
      })
      await updateAdminSettingsClient({ website: data.website || "" })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function onNotificationSubmit(data: NotificationFormValues) {
    setIsSaving(true)
    try {
      await updateAdminSettingsClient(data)
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      console.error("Failed to update notifications:", error)
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function onAppearanceSubmit(data: AppearanceFormValues) {
    setIsSaving(true)
    try {
      await updateAdminSettingsClient(data)
      setTheme(data.theme)
      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been saved.",
      })
    } catch (error) {
      console.error("Failed to update appearance:", error)
      toast({
        title: "Error",
        description: "Failed to update appearance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Avatar must be 2MB or smaller.", variant: "destructive" })
      return
    }
    setIsUploadingAvatar(true)
    try {
      const res = (await uploadAvatarClient(file)) as { url?: string; data?: { url?: string; avatarUrl?: string } }
      const newUrl = res?.data?.avatarUrl ?? res?.data?.url ?? res?.url
      setUser((prev) => (prev ? { ...prev, avatarUrl: newUrl ?? prev.avatarUrl } : prev))
      toast({ title: "Avatar updated", description: "Your profile picture has been changed." })
    } catch {
      toast({ title: "Upload failed", description: "Could not upload the avatar. Please try again.", variant: "destructive" })
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await performAdminLogout()
    } catch {
      setIsLoggingOut(false)
      toast({ title: "Error", description: "Failed to sign out. Please try again.", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Separator />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="group relative h-20 w-20 shrink-0 rounded-full"
                      aria-label="Change avatar"
                    >
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatarUrl ?? user?.image} alt={user?.name} referrerPolicy="no-referrer" />
                        <AvatarFallback className="text-lg">{user?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                      </Avatar>
                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {isUploadingAvatar ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                      </span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleAvatarChange} />
                    <div className="space-y-2">
                      <h3 className="font-medium">{user?.name || "Admin User"}</h3>
                      <Badge variant="secondary">{user?.role || "Admin"}</Badge>
                      <div>
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar}>
                          {isUploadingAvatar ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</> : <><Camera className="mr-2 h-4 w-4" />Change Avatar</>}
                        </Button>
                        <p className="mt-1.5 text-xs text-muted-foreground">PNG, JPG, GIF or WebP. Max 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, USA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself..." className="resize-none" rows={4} {...field} />
                        </FormControl>
                        <FormDescription>Brief description for your profile. Maximum 500 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>Receive email notifications for important updates.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                            <FormDescription>Receive push notifications in your browser.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="weeklyDigest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Weekly Digest</FormLabel>
                            <FormDescription>Receive a weekly summary of activity.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="projectUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Project Updates</FormLabel>
                            <FormDescription>Get notified when projects are updated.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="securityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Security Alerts</FormLabel>
                            <FormDescription>Receive alerts about security-related events.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <FormDescription>Select your preferred theme for the dashboard.</FormDescription>
                        <FormControl>
                          <div className="grid grid-cols-3 gap-4 pt-2">
                            <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${field.value === "light" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                              <input type="radio" name="theme" value="light" checked={field.value === "light"} onChange={() => field.onChange("light")} className="sr-only" />
                              <Sun className="mx-auto h-6 w-6 mb-2" />
                              <span className="text-sm font-medium">Light</span>
                            </label>
                            <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${field.value === "dark" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                              <input type="radio" name="theme" value="dark" checked={field.value === "dark"} onChange={() => field.onChange("dark")} className="sr-only" />
                              <Moon className="mx-auto h-6 w-6 mb-2" />
                              <span className="text-sm font-medium">Dark</span>
                            </label>
                            <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${field.value === "system" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                              <input type="radio" name="theme" value="system" checked={field.value === "system"} onChange={() => field.onChange("system")} className="sr-only" />
                              <Monitor className="mx-auto h-6 w-6 mb-2" />
                              <span className="text-sm font-medium">System</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={appearanceForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <Globe className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="id">Indonesian</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appearanceForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                              <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account &amp; Security</CardTitle>
              <CardDescription>Your account details and sign-in methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account overview */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                      {user?.email || "—"}
                      {user?.emailVerified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="truncate text-sm font-medium">{user?.role || "USER"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="truncate text-sm font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Fingerprint className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="truncate font-mono text-xs font-medium">{user?.id || "—"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Connected accounts */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Connected accounts</h3>
                  <p className="text-sm text-muted-foreground">Sign-in providers linked to your account.</p>
                </div>
                {user?.oauthAccounts && user.oauthAccounts.length > 0 ? (
                  <div className="space-y-2">
                    {user.oauthAccounts.map((acc, i) => {
                      const provider = acc.provider || acc.providerId || "OAuth"
                      return (
                        <div key={`${provider}-${i}`} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium capitalize">{provider}</p>
                              <p className="text-xs text-muted-foreground">Connected</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                    Signed in with email &amp; password. No external providers linked.
                  </div>
                )}
              </div>

              <Separator />

              {/* Sign out */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Sign out</h3>
                  <p className="text-sm text-muted-foreground">End your admin session on this device.</p>
                </div>
                <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing out…</> : <><LogOut className="mr-2 h-4 w-4" />Sign out</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
