import BlurFade from "@/components/magicui/blur-fade";
import { getAIData } from "@/services/visitor/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AIPage(props: Readonly<{
  searchParams: SearchParams;
}>) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query ?? "Hello";

  let response;
  try {
    response = await getAIData(query);
  } catch (error) {
    console.error("Error fetching AI data:", error);
    response = null;
  }

  const candidates = response?.response?.candidates ?? [];
  console.log(candidates);
  const formattedResponses = candidates.map((candidate) =>
    candidate?.content?.parts
      ?.map((part) => part?.text ?? "")
      .join(" ")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
  );
  console.log(formattedResponses);

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
          <Button type="submit">Submit</Button>
        </form>

        <div className="mt-4">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <div key={candidate?.avgLogprobs ?? index} className="mb-4 p-4 border rounded shadow">
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formattedResponses[index],
                    }}
                  />
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No candidates found. Please try another query.</p>
          )}
        </div>
      </>
    </BlurFade>
  );
}
