"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDay } from "@/components/layout/admin/admin-format"
import { PRINT_HEX } from "@/lib/print-hex"
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
// not by its column name. weeklyDigest controls nothing and stays hidden.
const BELL_SOURCES: { name: keyof NotificationValues; label: string; note: string }[] = [
  { name: "emailNotifications", label: "Feedback", note: "New messages from the feedback form." },
  { name: "pushNotifications", label: "Chat", note: "New messages in the public chat." },
  { name: "projectUpdates", label: "Tracker", note: "New cards on the tracker board." },
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
  oauthAccounts?: { provider?: string; providerId?: string }[]
}

// The CSS tokens flip with the active theme, so each half pins its own theme's colours through the hex copies.
const PAPER: CSSProperties = { backgroundColor: PRINT_HEX.paper, color: PRINT_HEX.ink }
const NIGHT: CSSProperties = { backgroundColor: PRINT_HEX.night, color: PRINT_HEX.nightInk }

/** The mini logo in each theme's own colours: light, dark, or half of each. */
function Swatch({ mode }: Readonly<{ mode: (typeof THEMES)[number]["value"] }>) {
  return (
    <span aria-hidden className="relative block size-16 shrink-0 border border-rule">
      {mode !== "dark" && (
        <span className="absolute inset-0 flex items-center justify-center" style={PAPER}>
          <Logo variant="mini" className="size-10" />
        </span>
      )}
      {mode !== "light" && (
        <span className={`absolute inset-0 flex items-center justify-center ${mode === "system" ? "[clip-path:inset(0_0_0_50%)]" : ""}`} style={NIGHT}>
          <Logo variant="mini" className="size-10" />
        </span>
      )}
    </span>
  )
}

/** A definition row with a dotted leader between term and value. */
function Leader({ term, children }: Readonly<{ term: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-baseline gap-2 py-1.5 text-small">
      <dt className="flex min-w-0 flex-1 items-baseline gap-2 text-ink-soft">
        {term}
        <span aria-hidden className="min-w-6 flex-1 border-b border-dotted border-rule-strong" />
      </dt>
      <dd className="min-w-0 text-right tabular-nums text-ink [overflow-wrap:anywhere]">{children}</dd>
    </div>
  )
}

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

  // Theme is not saved here: next-themes is its one source, set the moment a swatch is chosen.
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

  if (state === "loading") {
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-[44rem] border border-ink p-[3px]">
        <p className="sr-only">Loading settings</p>
        <div className="border border-rule p-5 sm:p-8">
          <div className="flex items-end gap-5 pb-6">
            <Skeleton className="size-20" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />
          <div className="mt-6 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (state === "failed" || !user) {
    return (
      <div className="mx-auto w-full max-w-[44rem] border-y border-rule py-10 text-center">
        <p className="text-small text-ink-soft">Your account did not load. The API may be down for a moment.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => void load()}>
          Try again
        </Button>
      </div>
    )
  }

  const providers = (user.oauthAccounts ?? []).map((account) => sentence(account.provider || account.providerId || "OAuth"))

  return (
    <div className="mx-auto w-full max-w-[44rem]">
      <article className="border border-ink p-[3px]">
        <div className="border border-rule p-5 sm:p-8">
          <header className="flex items-end gap-5 pb-6">
            <Avatar className="size-20">
              {(user.avatarUrl ?? user.image) && <AvatarImage src={user.avatarUrl ?? user.image} alt="" referrerPolicy="no-referrer" />}
              <AvatarFallback className="font-display text-h3">{user.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-display text-h2 text-ink [overflow-wrap:anywhere]">{user.name || "Admin"}</h2>
              {user.location && <p className="mt-1 font-display text-lead text-ink-soft">{user.location}</p>}
            </div>
          </header>
          <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

          <dl className="mt-6">
            <Leader term="Email">
              {user.email || "None"}
              {user.emailVerified && ", verified"}
            </Leader>
            <Leader term="Role">{sentence(user.role || "admin")}</Leader>
            <Leader term="Member since">{formatDay(user.createdAt) || "Unknown"}</Leader>
            <Leader term="Signs in with">{providers.length > 0 ? providers.join(", ") : "Email and password"}</Leader>
            <Leader term="User ID">{user.id}</Leader>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} aria-busy={uploading}>
              {uploading ? "Uploading…" : "Change portrait"}
            </Button>
            <p className="text-caption text-ink-soft">PNG, JPG, GIF or WebP, up to 2 MB.</p>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={onPortrait} />
          </div>
        </div>
      </article>

      <div className="mt-12">
        <SourceTabs
          tabs={[
            {
              id: "profile",
              label: "Profile",
              content: (
                <Card className="p-4 sm:p-6">
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
                </Card>
              ),
            },
            {
              id: "notifications",
              label: "Notifications",
              content: (
                <Card className="p-4 sm:p-6">
                  <p className="text-small text-ink-soft">Choose what the bell in the head counts.</p>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotifications)} className="mt-4">
                      <div className="border-t border-ink">
                        {BELL_SOURCES.map(({ name, label, note }) => (
                          <FormField
                            key={name}
                            control={notificationForm.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between gap-4 space-y-0 border-b border-rule py-3">
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
                </Card>
              ),
            },
            {
              id: "appearance",
              label: "Appearance",
              content: (
                <Card className="p-4 sm:p-6">
                  <RadioGroup
                    value={theme}
                    onValueChange={setTheme}
                    aria-labelledby="settings-theme"
                    className="gap-0"
                  >
                    <p id="settings-theme" className="font-display text-h4 text-ink">
                      Theme
                    </p>
                    <p className="mt-1 text-small text-ink-soft">Applies at once, in this browser.</p>
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                      {THEMES.map(({ value, label }) => (
                        <Label key={value} className="flex cursor-pointer flex-col items-start gap-2 text-base font-normal">
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
                    <form onSubmit={appearanceForm.handleSubmit(onAppearance)} className="mt-8 grid gap-5 border-t border-rule pt-6 sm:grid-cols-2">
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
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
