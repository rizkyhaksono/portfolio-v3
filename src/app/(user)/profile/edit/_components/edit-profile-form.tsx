"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlateFigure } from "@/components/ui/plate-figure"
import { FormAlert } from "@/app/(authentication)/auth/_components/form-alert"
import { updateProfile, uploadProfileBanner } from "@/app/actions/profile"
import type { ProfileData } from "@/commons/types/profile"
import { track } from "@/lib/analytics"

const MAX_COVER_BYTES = 5 * 1024 * 1024

const formSchema = z.object({
  name: z.string().trim().min(2, "Names have at least 2 characters.").max(50, "Keep the name to 50 characters."),
  email: z.string().email("Enter an email address, like you@example.com."),
  headline: z.string().max(100, "Keep the headline to 100 characters."),
  location: z.string().max(100, "Keep the location to 100 characters."),
  about: z.string().max(500, "Keep the bio to 500 characters."),
  bannerUrl: z.string(),
})

type ProfileValues = z.infer<typeof formSchema>

const count = (value: string, max: number) => `${value.length} of ${max} characters.`

export function EditProfileForm({ profile }: Readonly<{ profile: ProfileData }>) {
  const router = useRouter()
  const coverInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      headline: profile.headline ?? "",
      location: profile.location ?? "",
      about: profile.about ?? "",
      bannerUrl: profile.bannerUrl ?? "",
    },
  })
  const { isSubmitting, isDirty, errors } = form.formState
  const bannerUrl = form.watch("bannerUrl")
  const busy = isSubmitting || uploading

  const onSubmit = async (values: ProfileValues) => {
    const data = new FormData()
    for (const [key, value] of Object.entries(values)) data.append(key, value)

    const result = await updateProfile(profile.id, data).catch(() => null)
    track("profile-save", { status: result?.ok ? "ok" : "error" })
    if (!result?.ok) {
      form.setError("root", { message: result?.message ?? "Your changes were not saved. Try again in a minute." })
      return
    }
    router.push("/profile")
  }

  const uploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (file.size > MAX_COVER_BYTES) {
      form.setError("bannerUrl", { message: "That image is over 5 MB. Choose a smaller one." })
      return
    }

    form.clearErrors("bannerUrl")
    setUploading(true)
    const data = new FormData()
    data.append("file", file)
    // The action's declared type drops `message`; the service sends it with every refusal.
    const result: { bannerUrl: string; message?: string } | null = await uploadProfileBanner(data).catch(() => null)
    setUploading(false)

    if (!result?.bannerUrl) {
      form.setError("bannerUrl", { message: result?.message ?? "The cover was not uploaded. Try again in a minute." })
      return
    }
    // The API stores the cover on upload, so it is not an unsaved change.
    form.setValue("bannerUrl", result.bannerUrl)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-[66ch] flex-col gap-8" aria-busy={isSubmitting}>
        <fieldset className="flex flex-col gap-3" aria-busy={uploading}>
          <legend className="mb-3 text-small font-semibold text-ink">Cover image</legend>
          {bannerUrl ? (
            <PlateFigure>
              <div className="relative aspect-[3/1]">
                <Image src={bannerUrl} alt="" fill unoptimized sizes="(min-width: 768px) 40rem, 100vw" className="object-cover" />
              </div>
            </PlateFigure>
          ) : (
            <div className="flex aspect-[3/1] items-center justify-center border border-dashed border-rule-strong font-display text-caption text-ink-soft">
              No cover yet.
            </div>
          )}

          <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={uploadCover} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => coverInput.current?.click()} disabled={busy}>
              {uploading ? "Uploading…" : bannerUrl ? "Replace cover" : "Upload a cover"}
            </Button>
            {bannerUrl && (
              <Button type="button" variant="ghost" onClick={() => form.setValue("bannerUrl", "", { shouldDirty: true })} disabled={busy}>
                Remove cover
              </Button>
            )}
          </div>
          <p className="text-small text-ink-soft">
            A wide image works best: PNG, JPG, GIF or WebP, up to 5 MB. A new cover is kept as soon as it uploads.
          </p>
          <FormAlert>{errors.bannerUrl?.message}</FormAlert>
        </fieldset>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} disabled={busy} />
              </FormControl>
              <FormDescription className="tabular-nums">{count(field.value, 50)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} disabled={busy} />
              </FormControl>
              <FormDescription>Used to sign in.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input {...field} disabled={busy} />
              </FormControl>
              <FormDescription className="tabular-nums">One line under your name. {count(field.value, 100)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input autoComplete="address-level2" placeholder="City, region" {...field} disabled={busy} />
              </FormControl>
              <FormDescription className="tabular-nums">{count(field.value, 100)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About you</FormLabel>
              <FormControl>
                <Textarea className="min-h-32 resize-y" {...field} disabled={busy} />
              </FormControl>
              <FormDescription className="tabular-nums">{count(field.value, 500)}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormAlert>{errors.root?.message}</FormAlert>

        <div className="flex flex-wrap justify-end gap-3 border-t border-rule pt-6">
          {isDirty ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" disabled={busy}>
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
                  <AlertDialogDescription>Your changes on this page will be lost.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.push("/profile")}>Discard changes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button asChild variant="outline">
              <Link href="/profile">Cancel</Link>
            </Button>
          )}
          <Button type="submit" disabled={busy || !isDirty}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
