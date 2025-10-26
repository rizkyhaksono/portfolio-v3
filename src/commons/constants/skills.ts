export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skills_data: SkillCategory[] = [
  {
    name: "Frontend Development",
    skills: [
      "React",
      "Next.js",
      "Typescript",
      "Javascript",
      "Vue.js",
      "Astro.js",
      "HTML5",
      "CSS3",
      "React Native",
      "Flutter",
    ]
  },
  {
    name: "UI/UX & Libraries",
    skills: [
      "Tailwind CSS",
      "Chakra UI",
      "Material UI",
      "Ant Design",
      "Bootstrap",
      "Styled Components",
      "Mantine",
      "Figma",
      "Framer Motion",
      "Responsive Design",
    ]
  },
  {
    name: "Backend Development",
    skills: [
      "Express.js",
      "Nest.js",
      "Laravel",
      "Spring Boot",
      "ASP .NET",
      "Node.js",
      "Fastify",
      "Django",
      "Flask",
      "Gin",
      "Fiber",
      "GraphQL",
      "REST API",
      "tRPC",
      "Socket.io",
    ]
  },
  {
    name: "Programming Languages",
    skills: [
      "Javascript",
      "Typescript",
      "Python",
      "Java",
      "Kotlin",
      "Go",
      "C#",
      "C++",
      "C",
      "Rust",
      "Dart",
      "PHP",
    ]
  },
  {
    name: "Databases",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "MariaDB",
      "Firebase",
      "Supabase",
      "Prisma",
    ]
  },
  {
    name: "DevOps & Tools",
    skills: [
      "Docker",
      "Portainer",
      "Git",
      "GitHub Actions",
      "GitLab CI",
      "Jenkins",
      "AWS",
      "Azure",
      "Google Cloud",
      "Vercel",
      "Netlify",
      "Heroku",
      "Railway",
      "DigitalOcean",
      "Nginx",
      "Apache",
    ]
  },
  {
    name: "Testing & Quality",
    skills: [
      "Jest",
      "Cypress",
      "Playwright",
      "Vitest",
      "Postman",
      "SonarQube",
    ]
  },
  {
    name: "State Management",
    skills: [
      "Redux Toolkit",
      "Zustand",
      "Recoil",
      "Jotai",
      "React Query",
    ]
  },
  {
    name: "Build Tools & Bundlers",
    skills: [
      "Webpack",
      "Vite",
      "Turbo",
      "esbuild",
      "SWC",
      "Babel",
      "Nx",
    ]
  },
  {
    name: "Mobile Development",
    skills: [
      "React Native",
      "Flutter",
      "Expo",
      "Kotlin (Android)",
      "Java (Android)",
    ]
  },
  {
    name: "Data Science & AI",
    skills: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "OpenCV",
      "Matplotlib",
    ]
  },
  {
    name: "Blockchain & Web3",
    skills: [
      "Solidity (Learning)",
      "Web3.js (Learning)",
    ]
  }
];

export const skills_data_top = [
  "React",
  "Next.js",
  "Typescript",
  "Javascript",
  "Flutter",
  "Docker",
  "Git",
  "Tailwind CSS",
  "Chakra UI",
  "Material UI",
  "Ant Design",
  "Kotlin",
  "Java",
  "React Native",
  "Vue.js",
  "Angular",
  "Svelte",
  "HTML5",
  "CSS3",
];

export const skills_data_bottom = [
  "Portainer",
  "Express.js",
  "Nest.js",
  "Astro.js",
  "PostgreSQL",
  "MySQL",
  "Laravel",
  "Spring Boot",
  "Go",
  "ASP .NET",
  "Python",
  "Figma",
];

export const getAllSkills = (): string[] => {
  return skills_data.reduce((acc, category) => {
    return [...acc, ...category.skills];
  }, [] as string[]);
};

export const getSkillsByCategory = (categoryName: string): string[] => {
  const category = skills_data.find(cat => cat.name === categoryName);
  return category ? category.skills : [];
};

export const searchSkills = (query: string): string[] => {
  const allSkills = getAllSkills();
  return allSkills.filter(skill =>
    skill.toLowerCase().includes(query.toLowerCase())
  );
};

export const getRandomSkills = (count: number): string[] => {
  const allSkills = getAllSkills();
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const skillsStats = {
  totalSkills: getAllSkills().length,
  totalCategories: skills_data.length,
  averageSkillsPerCategory: Math.round(getAllSkills().length / skills_data.length),
  categoryWithMostSkills: skills_data.reduce((prev, current) =>
    prev.skills.length > current.skills.length ? prev : current
  ).name,
  categoryWithLeastSkills: skills_data.reduce((prev, current) =>
    prev.skills.length < current.skills.length ? prev : current
  ).name,
};