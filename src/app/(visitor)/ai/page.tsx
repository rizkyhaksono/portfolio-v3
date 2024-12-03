import BlurFade from "@/components/magicui/blur-fade";
import { getAIData } from "@/services/visitor/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDXComponent from "@/components/ui/mdx-components";

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
        <h1 className="text-lg font-bold">{"Natee AI ⚡"}</h1>
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
              className="bg-secondary p-4 rounded-lg shadow-md mt-4"
            >
              <MDXComponent>{candidate.content.parts.map((part) => part.text).join(" ")}</MDXComponent>
            </div>
          ))}
        </div>
      </>
    </BlurFade>
  );
}
