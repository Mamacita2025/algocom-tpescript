// components/SafeImage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";

type SafeImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  alt = "Imagem",
  className,
  style,
  fallbackSrc = "/images/placeholder.jpg",
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        onError={handleError}
      />
    </div>
  );
}
