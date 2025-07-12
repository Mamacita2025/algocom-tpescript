// components/FloatingAd.tsx
import AdSense from "./AdSense";

export default function FloatingAd() {
  return (
    <div style={{
      position: "fixed",
      bottom: 16,
      right: 16,
      width: 300,         /* largura do ad slot padrão */
      zIndex: 9999,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    }}>
      <AdSense slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT!} />
    </div>
  );
}
