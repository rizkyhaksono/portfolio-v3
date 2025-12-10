"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminAuthLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/v3/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token if provided in response
      if (data.token) {
        document.cookie = `NATEE_V3_TOKEN=${data.token}; path=/; max-age=2592000`; // 30 days
      }

      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
      colorClass: "hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      provider: "github",
      colorClass: "hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      provider: "discord",
      colorClass: "hover:bg-indigo-50 dark:hover:bg-indigo-950",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      provider: "facebook",
      colorClass: "hover:bg-blue-50 dark:hover:bg-blue-950",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to your admin account to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
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
          <div className="grid grid-cols-2 gap-3">
            {oauthProviders.map((provider) => (
              <Button
                key={provider.provider}
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin(provider.provider)}
                className={`${provider.colorClass} transition-colors`}
                disabled={isLoading}
              >
                <provider.icon className="mr-2 h-5 w-5" />
                {provider.name}
              </Button>
            ))}
          </div>

          {/* Footer Links */}
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}