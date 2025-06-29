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
      <div className="text-center mb-6">
        <p className="text-center text-xl font-semibold">Code Snippets</p>
        <div className="mt-2 text-sm text-muted-foreground">
          A collection of useful code snippets I frequently use or reference.
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 mb-4">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> {`Under development....`}
          </p>
        </CardContent>
      </Card>

      <Tabs
        className='w-full text-center'
        value={activeLanguage}
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
    </BlurFade>
  );
}