import { MetadataRoute } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";
import { PRINT_HEX } from "@/lib/print-hex";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: MetadataConstants.ogPersonTitle,
    short_name: "Rizky Haksono",
    description: MetadataConstants.description,
    start_url: "/",
    display: "standalone",
    background_color: PRINT_HEX.paper,
    theme_color: PRINT_HEX.paper,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
