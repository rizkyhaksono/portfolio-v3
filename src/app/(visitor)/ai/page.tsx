import BlurFade from "@/components/magicui/blur-fade";
import { getAIData } from "@/services/visitor/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AIPage(props: Readonly<{
  searchParams: SearchParams
}>) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query ?? "Hello";
  const response = await getAIData(query);
  const formattedResponses = response?.response?.candidates.map((candidate) => {
    return candidate.content.parts
      .map((part) => part.text)
      .join(" ")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  });

  return (
    <BlurFade delay={0.25} inView>
      <>
        <h1 className="text-lg font-bold">{"Natee AI 😁 [Working on Progress]"}</h1>
        <form method="GET" action="/ai" className="flex flex-1 items-center mt-2 gap-2">
          <Input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Ask something..."
          />
          <Button type="submit">
            Submit
          </Button>
        </form>

        <div className="mt-4">
          {response?.response?.candidates.map((candidate, index) => (
            <div key={candidate?.avgLogprobs} className="mb-4 p-4 border rounded shadow">
              <p className="">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formattedResponses[index],
                  }}
                />
              </p>
            </div>
          ))}
        </div>
      </>
    </BlurFade>
  );
}
