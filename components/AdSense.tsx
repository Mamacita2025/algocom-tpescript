// components/AdSense.tsx
"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot?: string;
}

export default function AdSense({
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT!,
}: AdSenseProps) {
const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const el = insRef.current;
    if (!el || el.getAttribute("data-ad-injected") === "true") return;

   

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
        minWidth: 0,
        minHeight: 150,
        height: "auto",
      }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
