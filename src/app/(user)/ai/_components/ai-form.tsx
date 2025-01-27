"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { isHaveValidToken } from "@/app/actions";
import { requestAIChat } from "@/services/user/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDXComponent from "@/components/ui/mdx-components";
import Typography from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import AIChat from "./ai-chat";

export default function AIForm() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isHaveValidToken().then((res) => setIsTokenValid(res));
    isTokenValid ? toast.success("You are logged in.") : toast.error("Please log in to access AI chat features.");
    if (query) {
      setLoading(true);
      toast.promise(requestAIChat(query).then((res) => {
        setData(res?.data);
        setLoading(false);
      }), {
        loading: "Loading ...",
        success: () => `Successfully fetched: ${query}`,
        error: (err) => err.message,
      });
    }
  }, [isTokenValid, query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(inputValue);
  };

  return (
    <>
      {isTokenValid ? (
        <>
          <div className="sticky top-0 z-50 py-10 bg-background/10 backdrop-blur-sm">
            <Typography.H3>Etan AI 😼</Typography.H3>
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 items-center mt-2 gap-2"
            >
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Rawr..."
                className="w-full h-12"
              />
              <Button type="submit" className="h-12">Submit</Button>
            </form>
          </div>

          <div className="my-4">
            {loading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-96 h-5" />
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-80 h-5" />
                <Skeleton className="w-52 h-5" />
                <Skeleton className="w-72 h-5" />
              </div>
            ) : (
              <MDXComponent>{data}</MDXComponent>
            )}
            <AIChat />
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full">
          <Typography.H3>Etan AI 😼</Typography.H3>
          <Link href={"/auth"}>
            <Button variant="default" className="w-full mt-4" size={"sm"}>
              Please log in to access AI chat features.
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
