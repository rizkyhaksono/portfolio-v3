"use client";

import { useState, useEffect } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { getAIData } from "@/services/visitor/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDXComponent from "@/components/ui/mdx-components";
import Typography from "@/components/ui/typography";
import { toast } from 'sonner';

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(inputValue);
  };

  useEffect(() => {
    if (query) {
      toast.promise(
        getAIData(query).then((res) => setData(res)),
        {
          loading: "Loading fetching...",
          success: `Data fetched successfully: ${query}`,
          error: "Error fetching data",
        }
      );
    }
  }, [query]);


  return (
    <BlurFade delay={0.25} inView>
      <>
        <Typography.H2 className="text-lg font-bold">Nateenese AI ⚡</Typography.H2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 items-center mt-2 gap-2"
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
      </>
    </BlurFade>
  );
}
