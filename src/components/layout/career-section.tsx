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
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  Learn more{" "}
                  <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </a>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
              </li>
              <li className="ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
              </li>
            </ol>
          </div>
          <div className="bg-muted/80 dark:bg-muted/20 p-5 rounded-md">
            Work Experience
            <div>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, architecto assumenda. Ipsum maiores ratione cupiditate labore dolores facere fugit aut nobis, quia quidem nesciunt quis architecto error voluptatibus illo amet.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
