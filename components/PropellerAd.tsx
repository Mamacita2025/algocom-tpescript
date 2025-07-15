// components/PropellerAd.tsx
"use client";

import { useEffect } from "react";

interface PropellerAdProps {
  zoneId: number;
  /** 
   * Exemplo de uso:
   *  • Pop-under: chamar no mount para abrir automaticamente
   *  • Banner: renderiza dentro do fluxo
   */
  type: "popunder" | "banner";
  style?: React.CSSProperties;
}

export default function PropellerAd({ zoneId, type, style }: PropellerAdProps) {
  useEffect(() => {
    if (typeof window.PropellerAds === "undefined") return;

    if (type === "popunder") {
      // dispara pop-under uma vez assim que o SDK estiver carregado
      window.PropellerAds.displayAd(zoneId);
    } else if (type === "banner") {
      // banner é renderizado num <div id="propeller-zone-xxx">
      window.PropellerAds.displayAd(zoneId);
    }
  }, [zoneId, type]);

  // Para banners: o SDK injeta o <iframe> dentro dessa div
  return type === "banner" ? (
    <div id={`propeller-zone-${zoneId}`} style={style} />
  ) : null;
}
