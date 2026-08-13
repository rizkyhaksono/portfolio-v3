import { JOB_TITLE } from "@/commons/constants/author"

export const MetadataConstants = {
  creator: "Muhammad Rizky Haksono",
  jobTitle: JOB_TITLE,
  description: `Muhammad Rizky Haksono is a ${JOB_TITLE} building production LLM systems — RAG, MCP, and cloud-native agents.`,
  keyword: `Muhammad Rizky Haksono, ${JOB_TITLE}, machine learning, LLM, RAG, MCP, developer, frontend, backend, UI/UX`,
  pageTitle: `Rizky Haksono | ${JOB_TITLE}`,
  ogTitle: `Muhammad Rizky Haksono | ${JOB_TITLE}`,
  ogPersonTitle: `Muhammad Rizky Haksono - ${JOB_TITLE}`,
  authors: {
    name: "Muhammad Rizky Haksono",
    url: process.env.DOMAIN,
  },
  openGraph: {
    url: process.env.DOMAIN,
    siteName: "Rizky Haksono",
    locale: "id-ID",
  },
  exTitle: "| natee",
  profile:
    "https://res.cloudinary.com/drbpzysws/image/upload/v1735786873/portfolio/banner%20v2.png",
};
