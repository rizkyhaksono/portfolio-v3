import fs from "fs"
import path from "path"

const dir = path.join(process.cwd(), "content", "roadmap")
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") && (f.includes("intermediate") || f.includes("advanced")))

for (const file of files) {
  const f = path.join(dir, file)
  let c = fs.readFileSync(f, "utf8")
  c = c.replace(/from "@\/components\/ui\/accordion"\r?\n(##)/g, 'from "@/components/ui/accordion"\n\n$1')
  c = c.replace(/at `http:\/\/api-service\.default\.svc\.cluster\.local`/g, "at http://api-service.default.svc.cluster.local")
  c = c.replace(/sends `initialize`/g, "sends initialize")
  c = c.replace(/Use `defineAsyncComponent`/g, "Use defineAsyncComponent")
  c = c.replace(/in `server\/api\//g, "in server/api/")
  c = c.replace(/text: `Review: \$\{req\.params\.arguments\?\.code\}`/g, 'text: "Review: " + (req.params.arguments?.code ?? "")')
  // Fix nested fences inside Tabs in express error handling
  c = c.replace(
    /<TabsContent value="err">\n```javascript\n([\s\S]*?)\n```\n  <\/TabsContent>/g,
    '<TabsContent value="err">\n\n<CodeSnippet language="javascript">{`' + "$1" + '`}</CodeSnippet>\n  </TabsContent>',
  )
  c = c.replace(
    /<TabsContent value="404">\n```javascript\n([\s\S]*?)\n```\n  <\/TabsContent>/g,
    '<TabsContent value="404">\n\n<CodeSnippet language="javascript">{`' + "$1" + '`}</CodeSnippet>\n  </TabsContent>',
  )
  fs.writeFileSync(f, c)
  console.log("fixed", file)
}
