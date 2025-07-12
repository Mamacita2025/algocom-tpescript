// components/AdSense.tsx
import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot?: string;
}

export default function AdSense({
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT!,
}: AdSenseProps) {
  // usaremos any para ref em <ins>, pois HTMLModElement pode ser pouco conhecido
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insRef = useRef<any>(null);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    // garante que só injetaremos uma única vez
    if (el.getAttribute("data-ad-injected") === "true") return;

    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});

    // marca como injetado pra não repetir
    el.setAttribute("data-ad-injected", "true");
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{
        display: "block",
        textAlign: "center",
        width: "100%",
         boxSizing: "border-box",
        minWidth: 300,
        minHeight: 150,
      }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
