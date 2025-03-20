"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProfileResponse } from "@/commons/types/profile"
import { updateProfile } from "@/app/actions/profile"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function EditProfileForm({ profile }: Readonly<{ profile: ProfileResponse }>) {
  const router = useRouter()

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    about: z.string().optional(),
    headline: z.string().optional(),
    location: z.string().optional(),
    bannerUrl: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      about: "",
      headline: "",
      location: "",
      bannerUrl: "",
    },
  })

  const { reset } = form

  useEffect(() => {
    if (profile) {
      reset({
        email: profile.data.email,
        name: profile.data.name,
        about: profile.data.about ?? "",
        headline: profile.data.headline ?? "",
        location: profile.data.location ?? "",
        bannerUrl: profile.data.bannerUrl ?? "",
      });
    }
  }, [profile, reset])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("name", values.name);
    formData.append("about", values.about ?? "");
    formData.append("headline", values.headline ?? "");
    formData.append("location", values.location ?? "");
    formData.append("bannerUrl", values.bannerUrl ?? "");

    toast.promise(updateProfile(profile.data.id, formData), {
      loading: "Updating profile...",
      success: (res) => {
        router.push("/profile")
        return "Profile updated successfully."
      },
      error: "Failed to update profile.",
    })
    reset();
  }

  return (
    <>
      <div className="mb-5 text-start text-sm font-normal underline underline-offset-4">
        <Link
          href={"/profile"}
        >
          Back
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder={profile.data.email} {...field} />
                </FormControl>
                <FormDescription>
                  Your email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={profile.data.name} {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Input placeholder={profile?.data?.about ?? "-"} {...field} />
                </FormControl>
                <FormDescription>
                  Tell us about yourself.
                </FormDescription>
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
                  <Input placeholder={profile?.data?.headline ?? "-"} {...field} />
                </FormControl>
                <FormDescription>
                  A short description about yourself.
                </FormDescription>
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
                  <Input placeholder={profile?.data?.location ?? "-"} {...field} />
                </FormControl>
                <FormDescription>
                  Your current location.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="bannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner URL</FormLabel>
                <FormControl>
                  <Input placeholder={profile?.data?.bannerUrl ?? "-"} {...field} />
                </FormControl>
                <FormDescription>
                  Your banner image URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}