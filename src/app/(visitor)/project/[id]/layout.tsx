import type { Metadata } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";
import { getAllProject } from "@/services/visitor/project";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projects = await getAllProject();
  const project = projects?.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Rizky Haksono`,
    description: project.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.DOMAIN ?? ""
    ),
    keywords: MetadataConstants.keyword,
    creator: MetadataConstants.creator,
    authors: {
      name: MetadataConstants.creator,
      url: MetadataConstants.openGraph.url,
    },
    openGraph: {
      title: project.title,
      description: project.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
      images: project.image ? [project.image] : [MetadataConstants.profile],
      url: MetadataConstants.openGraph.url,
      siteName: MetadataConstants.openGraph.siteName,
      locale: MetadataConstants.openGraph.locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProjectDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
