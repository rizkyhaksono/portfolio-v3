"use client";

import { useEffect, useState, useCallback } from "react";
import { getAIChat } from "@/services/user/ai";
import MDXComponent from "@/components/ui/mdx-components";
import { MessageCircle, User, Bot } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AIChat() {
  const [data, setData] = useState<any>([]);

  const fetchAIChat = useCallback(async () => {
    const res = await getAIChat();
    setData(res);
  }, []);

  useEffect(() => {
    fetchAIChat();
  }, [fetchAIChat]);

  return (
    <>
      {data?.data?.map((item: any, index: number) => (
        <Card key={item.title + index} className="mb-6 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border-b-0">
              <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-accent">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="size-4 text-muted-foreground" />
                  <div className="flex flex-1 items-center space-x-2">
                    <span className="font-medium whitespace-nowrap truncate max-[600px]:max-w-96 max-w-screen-sm">{item.title}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="p-0">
                  {item.messages.map((message: any, msgIndex: number) => (
                    <div key={msgIndex} className="px-10 pt-2">
                      <div className="flex flex-col items-end mb-2">
                        <Avatar className="size-8" >
                          <AvatarImage src={"https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"} alt="User" loading="lazy" />
                        </Avatar>
                        <span className="font-medium whitespace-nowrap truncate max-[600px]:max-w-96 max-w-screen-sm">{item.title}</span>
                      </div>
                      <Avatar className="size-8" >
                        <AvatarImage src={"https://i.pinimg.com/736x/d8/01/bd/d801bdf6c0a8102723413903f0565876.jpg"} alt="Bot" />
                      </Avatar>
                      <MDXComponent>
                        {message.msg}
                      </MDXComponent>
                    </div>
                  ))}
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </>
  );
}
