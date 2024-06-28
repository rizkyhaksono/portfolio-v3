export default function CareerSection() {
  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-md mt-10">
      <p className="text-center text-2xl font-semibold mb-5">Career</p>
      <div className="">
        <div>{"My career started in 2020 when I started working as a software developer. Since then, I have worked on a variety of projects, ranging from small websites to large web applications."}</div>
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-muted/80 dark:bg-muted/20 p-5 rounded-md">
            <p className="text-lg font-semibold mb-2">Education</p>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Sept 2021 - Now</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">University Of Muhammadiyah Malang</h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{"Engineer's Degreee, Informatika"}</p>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Jul 2018 - Jul 2021</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMA Negeri 2 Denpasar</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">MIPA</p>
              </li>
            </ol>
          </div>
          <div className="bg-muted/80 dark:bg-muted/20 p-5 rounded-md">
            <p className="text-lg font-semibold mb-2">Work Experience</p>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Aug 2023 - Dec 2023</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Infinite Learning Indonesia - Study Independent</h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Completed an intensive Full Stack Developer bootcamp encompassing frontend and backend development, along with UI/UX design principles. Acquired proficiency in frontend technologies such as HTML5, CSS3, JavaScript (ES6+), and React.js for building interactive user interfaces. </p>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Aug 2022 - Now</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informatics Laboratory UMM</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Work as Laboratory Assistant, and Software Engineer</p>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Feb 2024 - Jul 2024</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">BIGIO.ID - Intern</h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Work as Full Stack Developer</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
