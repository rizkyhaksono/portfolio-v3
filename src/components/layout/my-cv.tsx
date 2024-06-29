export default function MyCV() {
  return (
    <div className="bg-white text-black p-4 mt-5 rounded-xl shadow-lg w-full max-w-full h-96 overflow-y-auto">
      <div className="container mx-auto">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold">Muhammad Rizky Haksono</h1>
          <p className="text-base">
            <a className="hover:underline hover:underline-offset-4" href="mailto:mrizkyhaksono@gmail.com">Email: mrizkyhaksono@gmail.com</a> {` | `}
            <a className="hover:underline hover:underline-offset-4" href="https://www.linkedin.com/in/rizkyhaksono/" target="_blank">LinkedIn: linkedin.com/in/rizkyhaksono
            </a>
          </p>
        </header>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Professional Summary</h2>
          <p>Experienced software engineer with a strong background in developing scalable web applications and working across the full stack. Proficient in JavaScript, Typescript, and Java with a passion for learning new technologies and improving software performance.</p>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Education</h2>
          <div>
            <h3 className="text-lg font-semibold">Bachelor of Science in Computer Science</h3>
            <p>University of Muhammadiyah Malang</p>
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Professional Experience</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Software Engineer</h3>
            <p>XYZ Company, San Francisco, CA</p>
            <p>January 2020 - Present</p>
            <ul className="list-disc list-inside">
              <li>Developed and maintained web applications using React and Node.js</li>
              <li>Implemented RESTful APIs with Express and integrated with front-end applications</li>
              <li>Worked with Docker and Kubernetes for containerization and orchestration</li>
              <li>Collaborated with cross-functional teams to define and implement new features</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Junior Software Engineer</h3>
            <p>ABC Inc., New York, NY</p>
            <p>June 2018 - December 2019</p>
            <ul className="list-disc list-inside">
              <li>Assisted in the development of internal tools using Python and Django</li>
              <li>Participated in code reviews and contributed to improving code quality</li>
              <li>Maintained and optimized SQL queries and database performance</li>
            </ul>
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Skills</h2>
          <ul className="list-disc list-inside">
            <li>JavaScript, Typescript, React</li>
            <li>Java, Spring Boot</li>
            <li>SQL, MySQL, PostgreSQL</li>
            <li>Git, Docker, Portainer</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
