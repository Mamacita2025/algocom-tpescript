// components/FloatingAd.tsx
"use client";

import AdSense from "./AdSense";

export default function FloatingAd() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: "clamp(200px, 80vw, 300px)",
        maxWidth: "100%",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        pointerEvents: "auto",
      }}
    >
      <AdSense slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT!} />
    </div>
  );
}
