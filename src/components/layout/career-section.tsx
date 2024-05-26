import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function CareerSection() {
  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-xl mt-10">
      <p className="text-center">Career</p>
      <div className="">
        <div>{"My career started in 2020 when I started working as a software developer. Since then, I have worked on a variety of projects, ranging from small websites to large web applications."}</div>
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-muted/80 dark:bg-muted/20 p-5 rounded-md">
            Education
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
              </li>
            </ol>
          </div>
          <div className="bg-muted/80 dark:bg-muted/20 p-5 rounded-md">
            Work Experience
            {/* <ScrollArea className="w-full rounded-md border mt-5">
              <div className="flex space-x-4 p-4 overflow-x-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <div className="bg-white/40 dark:bg-muted/20 p-5 rounded-xl" key={item}>
                    <p className="text-center">Project {item}</p>
                    <p className="w-52">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et sapien nec ipsum tincidunt fermentum. Nullam et sapien nec ipsum tincidunt fermentum."}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea> */}
          </div>
        </div>
      </div>
    </div>
  )
}
