import { MetadataRoute } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: MetadataConstants.ogPersonTitle,
    short_name: "Rizky Haksono",
    description: MetadataConstants.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
