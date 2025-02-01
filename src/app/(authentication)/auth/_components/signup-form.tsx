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
import { authSignup } from "@/services/visitor/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Typography from "@/components/ui/typography";

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
})

export default function SignupForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    const promise = authSignup(values.email, values.password, values.name);
    toast.promise(promise, {
      loading: "Registering...",
      success: (res) => {
        if (res?.name === "CONFLICT") {
          toast.error("Email already exists!");
          router.push("/auth");
        } else {
          toast.success("Registration successful!");
          router.refresh();
        }
        return toast.dismiss();
      },
      error: (err) => `Error: ${err.message}`,
    });
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Typography.H4 className="text-2xl font-bold">Join with me</Typography.H4>
                <Typography.P className="text-balance text-muted-foreground">Create your account</Typography.P>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="example name" {...field} />
                    </FormControl>
                    <FormDescription>Enter your name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            src="https://i.pinimg.com/736x/d8/01/bd/d801bdf6c0a8102723413903f0565876.jpg"
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