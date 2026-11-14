"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Fingerprint, KeyRound, Mail, UserRound } from "lucide-react"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Properties } from "@/components/ui/properties"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusLine } from "@/components/ui/status-line"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDay } from "@/components/layout/admin/admin-format"
import { switchTheme } from "@/components/layout/theme-toggle"
import { THEME_HEX } from "@/lib/theme-hex"
import {
  getAdminSettingsClient,
  getCurrentUserClient,
  updateAdminSettingsClient,
  updateUserClient,
  uploadAvatarClient,
} from "@/services/admin/client-services"
import { SourceTabs } from "../_components/source-tabs"

const profileSchema = z.object({
  name: z.string().trim().min(2, "The name needs at least 2 characters."),
  email: z.string().trim().email("Use a full email address."),
  website: z.string().trim().url("Use a full address, starting with https://.").or(z.literal("")),
  location: z.string().trim().max(100, "Keep the place under 100 characters."),
  bio: z.string().max(500, "Keep the bio under 500 characters."),
})

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  projectUpdates: z.boolean(),
  securityAlerts: z.boolean(),
})

const appearanceSchema = z.object({ language: z.string(), timezone: z.string() })

type NotificationValues = z.infer<typeof notificationSchema>

// The API reuses older AdminSettings columns for the bell's four sources (portfolio-v3-api
// controller/notifications/getNotifications.ts), so each switch is labelled by the source it controls,
// not by its column name. weeklyDigest controls nothing and projectUpdates (tracker) has no page any more; both stay hidden.
const BELL_SOURCES: { name: keyof NotificationValues; label: string; note: string }[] = [
  { name: "emailNotifications", label: "Feedback", note: "New messages from the feedback form." },
  { name: "pushNotifications", label: "Chat", note: "New messages in the public chat." },
  { name: "securityAlerts", label: "Claps", note: "New claps on posts and projects." },
]

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const

const LANGUAGES = [
  ["en", "English"],
  ["id", "Indonesian"],
  ["ja", "Japanese"],
  ["zh", "Chinese"],
] as const

const TIMEZONES = [
  ["UTC", "UTC"],
  ["Asia/Jakarta", "Jakarta (WIB)"],
  ["Asia/Tokyo", "Tokyo (JST)"],
  ["America/New_York", "New York"],
  ["Europe/London", "London"],
] as const

/** The same picture the admin sidebar shows: an uploaded portrait first, then the sign-in one. */
const portraitOf = (user: UserData) => user.avatarUrl ?? user.iconUrl ?? user.image

interface UserData {
  id: string
  name: string
  email: string
  about?: string
  location?: string
  image?: string
  avatarUrl?: string
  /** Where a Google sign-in keeps its picture; the sidebar reads it too (dashboard/layout.tsx). */
  iconUrl?: string
  role?: string
  createdAt?: string
  emailVerified?: boolean
  oauthAccounts?: { provider?: string; providerId?: string }[]
}

// The CSS tokens flip with the active theme, so each half pins its own theme's colours through the hex copies.
const LIGHT: CSSProperties = { backgroundColor: THEME_HEX.light.background, color: THEME_HEX.light.foreground }
const DARK: CSSProperties = { backgroundColor: THEME_HEX.dark.background, color: THEME_HEX.dark.foreground }

/** A type sample in each theme's own colours: light, dark, or half of each. */
function Swatch({ mode }: Readonly<{ mode: (typeof THEMES)[number]["value"] }>) {
  return (
    <span aria-hidden className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border">
      {mode !== "dark" && (
        <span className="absolute inset-0 flex items-center justify-center" style={LIGHT}>
          <span className="text-h1">Aa</span>
        </span>
      )}
      {mode !== "light" && (
        <span className={`absolute inset-0 flex items-center justify-center ${mode === "system" ? "[clip-path:inset(0_0_0_50%)]" : ""}`} style={DARK}>
          <span className="text-h1">Aa</span>
        </span>
      )}
    </span>
  )
}

/** Portrait and name, then the account's facts as Notion properties. */
function AccountIdentity({ user, providers, children }: Readonly<{ user: UserData; providers: string[]; children: ReactNode }>) {
  return (
    <section aria-labelledby="account-name" className="max-w-2xl">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {portraitOf(user) && <AvatarImage src={portraitOf(user)} alt="" referrerPolicy="no-referrer" />}
          <AvatarFallback className="text-h3">{user.name?.charAt(0) || "A"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 id="account-name" className="text-h3 text-foreground [overflow-wrap:anywhere]">
            {user.name || "Admin"}
          </h2>
          {user.location && <p className="text-small text-muted-foreground">{user.location}</p>}
        </div>
      </div>
      {children}
      <Properties
        className="mt-5"
        items={[
          { label: "Email", icon: <Mail strokeWidth={1.5} aria-hidden />, value: `${user.email || "None"}${user.emailVerified ? ", verified" : ""}` },
          { label: "Role", icon: <UserRound strokeWidth={1.5} aria-hidden />, value: sentence(user.role || "admin") },
          { label: "Member since", icon: <CalendarDays strokeWidth={1.5} aria-hidden />, value: formatDay(user.createdAt) || "Unknown" },
          { label: "Signs in with", icon: <KeyRound strokeWidth={1.5} aria-hidden />, value: providers.length > 0 ? providers.join(", ") : "Email and password" },
          { label: "User ID", icon: <Fingerprint strokeWidth={1.5} aria-hidden />, value: <span className="break-all font-mono text-caption">{user.id}</span> },
        ]}
      />
    </section>
  )
}

/** Sentence case for a role or a sign-in provider. */
const sentence = (word = "") => word.charAt(0).toLocaleUpperCase("en") + word.slice(1).toLowerCase()

export default function AdminSettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
  const [user, setUser] = useState<UserData | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", website: "", location: "", bio: "" },
  })
  const notificationForm = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { emailNotifications: true, pushNotifications: false, weeklyDigest: true, projectUpdates: true, securityAlerts: true },
  })
  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { language: "en", timezone: "UTC" },
  })

  const load = useCallback(async () => {
    setState("loading")
    try {
      const [me, settings] = await Promise.all([getCurrentUserClient() as Promise<UserData>, getAdminSettingsClient().catch(() => null)])
      setUser(me)
      profileForm.reset({
        name: me.name ?? "",
        email: me.email ?? "",
        website: settings?.website ?? "",
        location: me.location ?? "",
        bio: me.about ?? "",
      })
      if (settings) {
        const { emailNotifications, pushNotifications, weeklyDigest, projectUpdates, securityAlerts } = settings
        notificationForm.reset({ emailNotifications, pushNotifications, weeklyDigest, projectUpdates, securityAlerts })
        appearanceForm.reset({ language: settings.language || "en", timezone: settings.timezone || "UTC" })
      }
      setState("ready")
    } catch {
      setState("failed")
    }
  }, [profileForm, notificationForm, appearanceForm])

  useEffect(() => {
    void load()
  }, [load])

  const onProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return
    try {
      await updateUserClient(user.id, { name: values.name, email: values.email, about: values.bio, location: values.location })
      await updateAdminSettingsClient({ website: values.website })
      setUser({ ...user, name: values.name, email: values.email, about: values.bio, location: values.location })
      toast.success("Profile saved.")
      // The spine's name and portrait come from the server layout.
      router.refresh()
    } catch {
      toast.error("The profile did not save. Try again.")
    }
  }

  const onNotifications = async (values: NotificationValues) => {
    try {
      await updateAdminSettingsClient(values)
      toast.success("Notification sources saved.")
    } catch {
      toast.error("The notification sources did not save. Try again.")
    }
  }

  /** Theme is not saved here: next-themes is its one source, set the moment a swatch is chosen. */
  const onAppearance = async (values: z.infer<typeof appearanceSchema>) => {
    try {
      await updateAdminSettingsClient(values)
      toast.success("Language and time zone saved.")
    } catch {
      toast.error("Language and time zone did not save. Try again.")
    }
  }

  const onPortrait = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("The portrait must be 2 MB or smaller.")
      return
    }
    setUploading(true)
    try {
      const res = (await uploadAvatarClient(file)) as { url?: string; data?: { url?: string; avatarUrl?: string } }
      const avatarUrl = res?.data?.avatarUrl ?? res?.data?.url ?? res?.url
      setUser((prev) => (prev ? { ...prev, avatarUrl: avatarUrl ?? prev.avatarUrl } : prev))
      toast.success("Portrait updated.")
      router.refresh()
    } catch {
      toast.error("The portrait did not upload. Try again.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const header = <PageHeader title="Settings" description="Your account, what the bell counts, and how the admin looks." />

  if (state === "loading") {
    return (
      <>
        {header}
        <div aria-busy="true" className="max-w-2xl">
          <p className="sr-only">Loading settings</p>
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="mt-5 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (state === "failed" || !user) {
    return (
      <>
        {header}
        <StatusLine
          kind="failed"
          action={
            <Button variant="outline" size="sm" onClick={() => { void load() }}>
              Try again
            </Button>
          }
        >
          Your account did not load. The API may be down for a moment.
        </StatusLine>
      </>
    )
  }

  const providers = (user.oauthAccounts ?? []).map((account) => sentence(account.provider || account.providerId || "OAuth"))

  return (
    <>
      {header}
      <AccountIdentity user={user} providers={providers}>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} aria-busy={uploading}>
            {uploading ? "Uploading…" : "Change portrait"}
          </Button>
          <p className="text-caption text-muted-foreground">PNG, JPG, GIF or WebP, up to 2 MB.</p>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={onPortrait} />
        </div>
      </AccountIdentity>

      <div className="mt-12 max-w-2xl">
        <SourceTabs
          tabs={[
            {
              id: "profile",
              label: "Profile",
              content: (
                <div>
                  <Form {...profileForm}>
                    <form noValidate onSubmit={profileForm.handleSubmit(onProfile)} className="grid gap-5 sm:grid-cols-2">
                      {(
                        [
                          ["name", "Name", "text"],
                          ["email", "Email", "email"],
                          ["website", "Website", "url"],
                          ["location", "Place", "text"],
                        ] as const
                      ).map(([name, label, type]) => (
                        <FormField
                          key={name}
                          control={profileForm.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{label}</FormLabel>
                              <FormControl>
                                <Input type={type} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormDescription>Up to 500 characters.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="sm:col-span-2">
                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                          {profileForm.formState.isSubmitting ? "Saving…" : "Save profile"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ),
            },
            {
              id: "notifications",
              label: "Notifications",
              content: (
                <div>
                  <p className="text-small text-muted-foreground">Choose what the bell in the top bar counts.</p>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotifications)} className="mt-4">
                      <div>
                        {BELL_SOURCES.map(({ name, label, note }) => (
                          <FormField
                            key={name}
                            control={notificationForm.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between gap-4 space-y-0 border-b border-border py-3 last:border-b-0">
                                <div className="space-y-0.5">
                                  <FormLabel>{label}</FormLabel>
                                  <FormDescription>{note}</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <Button type="submit" className="mt-5" disabled={notificationForm.formState.isSubmitting}>
                        {notificationForm.formState.isSubmitting ? "Saving…" : "Save sources"}
                      </Button>
                    </form>
                  </Form>
                </div>
              ),
            },
            {
              id: "appearance",
              label: "Appearance",
              content: (
                <div>
                  <RadioGroup
                    value={theme}
                    onValueChange={(to) => switchTheme(setTheme, to)}
                    aria-labelledby="settings-theme"
                    className="gap-0"
                  >
                    <p id="settings-theme" className="text-small font-medium text-foreground">
                      Theme
                    </p>
                    <p className="mt-1 text-small text-muted-foreground">Applies at once, in this browser.</p>
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                      {THEMES.map(({ value, label }) => (
                        <Label key={value} className="flex cursor-pointer flex-col items-start gap-2 text-small font-normal">
                          <Swatch mode={value} />
                          <span className="flex min-h-11 items-center gap-2 md:min-h-0">
                            <RadioGroupItem value={value} />
                            {label}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>

                  <Form {...appearanceForm}>
                    <form onSubmit={appearanceForm.handleSubmit(onAppearance)} className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
                      <FormField
                        control={appearanceForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {LANGUAGES.map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
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
                            <FormLabel>Time zone</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a time zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIMEZONES.map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="sm:col-span-2">
                        <Button type="submit" disabled={appearanceForm.formState.isSubmitting}>
                          {appearanceForm.formState.isSubmitting ? "Saving…" : "Save language and time zone"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </div>
    </>
  )
}
