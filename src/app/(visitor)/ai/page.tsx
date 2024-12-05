import BlurFade from "@/components/magicui/blur-fade";
import { getAIData } from "@/services/visitor/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDXComponent from "@/components/ui/mdx-components";
import Typography from "@/components/ui/typography";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AIPage(props: Readonly<{
  searchParams: SearchParams;
}>) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query ?? "Hello";
  const response = await getAIData(query);

  return (
    <BlurFade delay={0.25} inView>
      <>
        <Typography.H2 className="text-lg font-bold">{"Natee AI ⚡"}</Typography.H2>
        <form method="GET" action="/ai" className="flex flex-1 items-center mt-2 gap-2">
          <Input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Ask something..."
          />
          <Button type="submit">Submit</Button>
        </form>

        <div className="mt-4">
          {response.response.candidates.map((candidate, index) => (
            <div
              key={candidate.avgLogprobs}
              className="bg-gray-200/40 dark:bg-[#303030]/40 px-4 py-2 rounded-lg shadow-sm mt-4"
            >
              <MDXComponent>{candidate.content.parts.map((part) => part.text).join(" ")}</MDXComponent>
            </div>
          ))}
        </div>
      </>
    </BlurFade>
  );
}
