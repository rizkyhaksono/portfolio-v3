"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authLogin } from "@/services/visitor/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storeCookie } from "@/app/actions/actions";
import Image from "next/image";
import Typography from "@/components/ui/typography";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    toast.promise(authLogin(values.email, values.password), {
      loading: "Logging in...",
      success: async (response) => {
        if (response?.name === "BAD_REQUEST") {
          return (`${response.message}, please try again`);
        }
        if (response?.status === "200") {
          await storeCookie("NATEE_V3_TOKEN", response?.token);
          router.push("/");
          return "Login successfuly";
        }
      },
      error: (err) => err,
    });
  };

  const handleOAuthLogin = (provider: string) => {
    // Redirect to OAuth endpoint
    window.location.href = `${API_URL}/v3/auth/${provider}`;
  };

  const oauthProviders = [
    {
      name: "Google",
      icon: FcGoogle,
      provider: "google",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      provider: "github",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      provider: "discord",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      provider: "facebook",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2 gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Typography.H4 className="text-2xl font-bold">Welcome back</Typography.H4>
                <Typography.P className="text-balance text-muted-foreground">Login to your account</Typography.P>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>Enter your email address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormDescription>Enter your password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="mt-4 w-full">Login</Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth Providers */}
            <div className="grid grid-cols-2 gap-2">
              {oauthProviders.map((provider) => (
                <Button
                  key={provider.provider}
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin(provider.provider)}
                  className="w-full"
                >
                  <provider.icon className="mr-2 h-4 w-4" />
                  {provider.name}
                </Button>
              ))}
            </div>
          </form>
        </Form>
        <div className="relative hidden bg-muted md:block">
          <Image
            src="https://i.pinimg.com/736x/a0/f5/cd/a0f5cdfbb60d16bd37ebc10c18e8da89.jpg"
            width={500}
            height={500}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
          />
        </div>
      </CardContent>
    </Card>
  )
}