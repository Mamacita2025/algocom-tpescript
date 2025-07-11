// components/AdBlock.tsx
export default function AdBlock({
  slot,
  style = { display: "block" },
}: {
  slot: string;
  style?: React.CSSProperties;
}) {
  // AdSense injeta o anúncio carregando este <ins> e chamando adsbygoogle.push
  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-XXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
