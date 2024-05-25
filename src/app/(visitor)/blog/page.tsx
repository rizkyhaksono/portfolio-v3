import BaseLayout from "@/components/layout/base-layout"

export default function BlogPage() {
  return (
    <BaseLayout>
      <div>
        <p className="text-center">Blog</p>
        <div className="mt-5 flex flex-col gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div className="bg-muted/40 dark:bg-muted/20 p-5 rounded-xl" key={item}>
              <p className="">Project {item}</p>
              <p className="">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et sapien nec ipsum tincidunt fermentum. Nullam et sapien nec ipsum tincidunt fermentum."}</p>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  )
}
