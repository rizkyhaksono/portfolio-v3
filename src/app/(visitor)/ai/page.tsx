"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { isHaveValidToken } from "@/app/actions";
import { requestAIChat } from "@/services/user/ai";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDXComponent from "@/components/ui/mdx-components";
import Typography from "@/components/ui/typography";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    isHaveValidToken().then((res) => setIsTokenValid(res));
    if (query) {
      toast.promise(requestAIChat(query).then((res) => setData(res?.data)), {
        loading: "Loading ...",
        success: () => `Data fetched successfully: ${query}`,
        error: (err) => err.message,
      });
    }
    toast.promise(isHaveValidToken, {
      loading: "Checking token ...",
      success: () => "You are logged in",
      error: () => "You are not logged in",
    })
  }, [query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(inputValue);
  };

  return (
    <>
      {isTokenValid ? (
        <BlurFade delay={0.25} inView>
          <div>
            <Typography.H3>Etan AI 😼</Typography.H3>
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 items-center mt-5 gap-2"
            >
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Rawr..."
              />
              <Button type="submit">Submit</Button>
            </form>

            <div className="mt-4">
              <MDXComponent>{data}</MDXComponent>
            </div>
          </div>
        </BlurFade>
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
