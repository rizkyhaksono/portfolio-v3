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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

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
          await storeCookie("auth_session", response?.token);
          router.push("/");
          return "Login successfuly";
        }
      },
      error: (err) => err,
    });
  };

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