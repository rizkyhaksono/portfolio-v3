import { MetadataRoute } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";
import { THEME_HEX } from "@/lib/theme-hex";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: MetadataConstants.ogPersonTitle,
    short_name: "Rizky Haksono",
    description: MetadataConstants.description,
    start_url: "/",
    display: "standalone",
    background_color: THEME_HEX.light.background,
    theme_color: THEME_HEX.light.background,
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
