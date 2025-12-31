"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileResponse } from "@/commons/types/profile"
import { updateProfile } from "@/app/actions/profile"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Mail, User, FileText, Briefcase, MapPin, ArrowLeft, Loader2, Save, X } from "lucide-react"
import Typography from "@/components/ui/typography"

export function EditProfileForm({ profile }: Readonly<{ profile: ProfileResponse }>) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(50, {
        message: "Name must not exceed 50 characters.",
      }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    about: z
      .string()
      .max(500, {
        message: "About section must not exceed 500 characters.",
      })
      .optional(),
    headline: z
      .string()
      .max(100, {
        message: "Headline must not exceed 100 characters.",
      })
      .optional(),
    location: z
      .string()
      .max(100, {
        message: "Location must not exceed 100 characters.",
      })
      .optional(),
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
      })
    }
  }, [profile, reset])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("name", values.name)
    formData.append("about", values.about ?? "")
    formData.append("headline", values.headline ?? "")
    formData.append("location", values.location ?? "")
    formData.append("bannerUrl", values.bannerUrl ?? "")

    toast.promise(updateProfile(profile.data.id, formData), {
      loading: "Updating profile...",
      success: (res) => {
        setIsSubmitting(false)
        router.push("/profile")
        return "Profile updated successfully!"
      },
      error: (err) => {
        setIsSubmitting(false)
        return "Failed to update profile. Please try again."
      },
    })
  }

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (globalThis.window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/profile")
      }
    } else {
      router.push("/profile")
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={handleCancel} className="mb-6 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>

      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>Update your personal information and public profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <Typography.H4 className="text-lg font-semibold border-b pb-2">Basic Information</Typography.H4>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>This is your public display name. ({field.value?.length || 0}/50)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>Your primary email address for account notifications</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <Typography.H4 className="text-lg font-semibold border-b pb-2">Professional Details</Typography.H4>

                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Professional Headline
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer | UI/UX Enthusiast" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>A brief professional tagline. ({field.value?.length || 0}/100)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>Your current city or region. ({field.value?.length || 0}/100)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <Typography.H4 className="text-lg font-semibold border-b pb-2">About You</Typography.H4>

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Biography
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell visitors about yourself, your interests, and what you do..." className="min-h-[120px] resize-none" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>A brief description about yourself. ({field.value?.length || 0}/500)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                  {isSubmitting ? (
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
    </>
  )
}
