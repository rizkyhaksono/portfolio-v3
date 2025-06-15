'use client';

import { useState } from 'react';
import BlurFade from "@/components/magicui/blur-fade";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyButton from '@/components/ui/copy-button';
import { snippets_data } from '@/commons/constants/snippets';


export default function SnippetsPage() {
  const [activeLanguage, setActiveLanguage] = useState<string>("javascript");

  return (
    <BlurFade delay={0.25} inView>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6">Code Snippets</h1>
        <p className="text-muted-foreground mb-8">
          A collection of useful code snippets I frequently use or reference.
        </p>

        <Tabs
          defaultValue="javascript"
          onValueChange={(value) => setActiveLanguage(value)}
        >
          <TabsList className="mb-6">
            {Object.keys(snippets_data).map(lang => (
              <TabsTrigger key={lang} value={lang} className="capitalize">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(snippets_data).map(([language, snippets]) => (
            <TabsContent key={language} value={language}>
              <div className="space-y-8">
                {snippets.map((snippet, index) => (
                  <Card key={snippet.title}>
                    <CardHeader>
                      <CardTitle>{snippet.title}</CardTitle>
                      <CardDescription>{snippet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative rounded-md overflow-hidden">
                        <CopyButton text={snippet.code} />
                        <SyntaxHighlighter
                          language={language === 'react' ? 'jsx' : language}
                          style={atomDark}
                          showLineNumbers
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.375rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          {snippet.code}
                        </SyntaxHighlighter>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </BlurFade>
  );
}