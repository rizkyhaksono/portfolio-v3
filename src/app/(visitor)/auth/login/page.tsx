"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseUser } from "@/lib/supabase/server";
import { useRouter } from "next/navigation";
import { setCookieValue, getCookieValue } from "@/lib/cookie-helper";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkUser = useCallback(async () => {
    const cookie = await getCookieValue("USER_SUPABASE_AUTH_COOKIE");
    if (cookie) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabaseUser.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      }
      console.log("Login successful:", data);
      setCookieValue("USER_SUPABASE_AUTH_COOKIE", data?.session?.access_token);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.error("Registration error:", error.message);
    }
  };

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href={"/"} className="hover:underline hover:underline-offset-8 transition duration-300">
              <p className="text-3xl font-bold">Login</p>
            </Link>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="********" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={`https://picsum.photos/1000/700`}
          priority
          alt="Image Home"
          width={1000}
          height={1000}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
