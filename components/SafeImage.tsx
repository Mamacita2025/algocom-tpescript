// components/SafeImage.tsx
"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import type { CSSProperties } from "react";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
};

export default function SafeImage({
  src,
  fallbackSrc = "/images/placeholder.jpg",
  containerClassName,
  containerStyle,
  ...imageProps
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Se estiver usando 'fill', o container deve ter posição e dimensões flexíveis
  // Caso contrário, usamos width/height vindos de props
  const wrapperStyle: CSSProperties = {
    position: "relative",
    display: imageProps.fill ? "block" : "inline-block",
    width: imageProps.fill ? "100%" : imageProps.width,
    height: imageProps.fill ? "100%" : imageProps.height,
    ...containerStyle,
  };

  return (
    <div className={containerClassName} style={wrapperStyle}>
      <Image
        {...imageProps}
        src={imgSrc}
        onError={handleError}
      />
    </div>
  );
}
