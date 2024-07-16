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
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Summary</h2>
          <p>Experienced software engineer with a strong background in developing scalable web applications and working across the full stack. Proficient in JavaScript, Typescript, and Java with a passion for learning new technologies and improving software performance.</p>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Educations</h2>
          <div>
            <h3 className="text-lg font-semibold">Bachelor of Science in Computer Science</h3>
            <p>University of Muhammadiyah Malang</p>
            <h3 className="text-lg font-semibold">Study Independent - Batch 5</h3>
            <p>Infinite Learning - Web Development</p>
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Experiences</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Software Engineer</h3>
            <p>Labotarory Informatics UMM</p>
            <p>September 2022 - Present</p>
            <ul className="list-disc list-inside">
              <li>Specializing in frontend and backend development, I work closely with a skilled team to enhance the performance and productivity of laboratory systems. These systems serve not only internal staff but also students, making my contributions crucial in shaping the educational journey of aspiring technology professionals.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Laboratory Assistant</h3>
            <p>Laboratory Informatics UMM</p>
            <p>September 2022 - Present</p>
            <ul className="list-disc list-inside">
              <li>As an Informatics Laboratory Assistant, my responsibilities include assisting instructors in conducting hands-on sessions, providing guidance and evaluating students during their laboratory activities. I find immense fulfillment in contributing to the education of aspiring technology professionals, while simultaneously gaining valuable expertise and enhancing my own proficiency in the field of informatics.</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Full Stack Developer Intern</h3>
            <p>PT Bejana Investidata Globalindo (BIGIO.ID)</p>
            <p>February 2024 - June 2024</p>
            <ul className="list-disc list-inside">
              <li>Contributed to the development of new features for the BIGIO Project, including maintenance of existing codebase and rigorous testing procedures. Collaborated closely with cross-functional teams to align development with project goals, timelines using Agile and Sprint.</li>
            </ul>
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-800 pb-1">Projects</h2>
          <ul className="list-disc list-inside">
            <li>Mahati - Mahati is Mobile Aplikasi Sahabat Hipertensi</li>
            <li>Sevenman Re-engineering </li>
            <li>Info Pangan Jakarta Re-engineering</li>
            <li>Adaro Water Solution</li>
            <li>eCRF Biofarma</li>
            <li>Chat Web Socket</li>
            <li>Otakudesu Watch Anime Website</li>
            <li>Anemia Education</li>
            <li>Apel Manis Kost</li>
            <li>Smart Recycling</li>
            <li>iLab Re-engineering</li>
            <li>Green Saver</li>
            <li>Puffer</li>
            <li>Jacket Lab Mobile Re-engineering</li>
            <li>Jacket Lab Web Optimization</li>
            <li>miLab</li>
            <li>Sirenta</li>
            <li>iLab Web</li>
            <li>Labit JasLab</li>
          </ul>
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
