import { useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function SafeImage({ src, alt = "Imagem", className, style }: SafeImageProps) {
  const [error, setError] = useState(false);
  const fallback = "/images/placeholder.jpg"; // Coloca um fallback local no teu projeto

  return (
    <img
      src={error || !src ? fallback : src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
}
