"use client";

import { cn } from "@/libs/utils";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

type ImageProps = {
  rounded?: string;
} & NextImageProps;

const ImageRender = (props: ImageProps) => {
  const { alt, src, className, rounded, ...rest } = props;
  const [isLoading, setLoading] = useState(true);

  return (
    <div
      className={cn(
        "overflow-hidden",
        isLoading ? "animate-pulse" : "",
        rounded
      )}
    >
      <NextImage
        className={cn(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          rounded,
          className
        )}
        src={src}
        alt={alt}
        loading="lazy"
        quality={100}
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};
export default ImageRender;