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

  const cleanDescription = project.description.replace(/<[^>]*>?/gm, '').substring(0, 160);
  const ogImage = project.image ?? `/api/og?type=project&title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(cleanDescription)}`;

  return {
    title: `${project.title} | Rizky Haksono`,
    description: cleanDescription,
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
      description: cleanDescription,
      images: [ogImage],
      url: MetadataConstants.openGraph.url,
      siteName: MetadataConstants.openGraph.siteName,
      locale: MetadataConstants.openGraph.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: cleanDescription,
      images: [ogImage],
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
