"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getAIChat } from "@/services/user/ai";
import MDXComponent from "@/components/ui/mdx-components";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function AIChat() {
  const [data, setData] = useState<any>([]);

  const fetchAIChat = useCallback(async () => {
    try {
      const res = await getAIChat();
      setData(res);
    } catch (error) {
      toast.error("Error fetching AI chat data");
    }
  }, []);

  useEffect(() => {
    fetchAIChat();
  }, [fetchAIChat]);

  return (
    <>
      {data?.data?.map((item: any, index: number) => (
        <div key={index} className="mb-5">
          <Collapsible>
            <CollapsibleTrigger className="flex border p-3 rounded-lg w-fit cursor-pointer my-5 ml-auto items-center gap-2">
              <ChevronDown className="size-4" />
              {item.title}
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.messages.map((message: any, index: number) => (
                <div key={index}>
                  <MDXComponent>{message.msg}</MDXComponent>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </>
  );
}
