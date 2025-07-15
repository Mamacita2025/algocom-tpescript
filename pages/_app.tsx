// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";

// Context & Layout
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";

// Components de anúncio
import AdSense from "@/components/AdSense";
import FloatingAd from "@/components/FloatingAd";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT!;
const ADSENSE_SLOT   = process.env.NEXT_PUBLIC_ADSENSE_SLOT!;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 1) Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(reg => console.log("Service Worker registrado:", reg))
        .catch(err => console.error("Erro ao registrar SW:", err));
    }

    // 2) Bootstrap JS
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .catch(err => console.error("Erro carregando Bootstrap JS:", err));

    // 3) Inicializa AdSense array
    if (typeof window !== "undefined") {
      (window.adsbygoogle = window.adsbygoogle || []);
    }
  }, []);

  return (
    <AuthProvider>
      <Head>
        {/* SEO e meta para responsividade */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Meta customizadas não são necessárias para AdSense/PropellerAds */}
      </Head>

      {/* 4) Script do Google AdSense */}
      <Script
        id="adsense-js"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />

      {/* 5) Layout: Navbar, Footer, etc. */}
      <Layout>
        {/* 6) PropellerAds Global */}
        <Script
          id="propellerads"
          strategy="afterInteractive"
          src="https://static.propellerads.com/ads.js"
          onError={() =>
            console.warn("Falha ao carregar script do PropellerAds")
          }
        />

        {/* 7) Conteúdo da página */}
        <Component {...pageProps} />

        {/* 8) AdSense Inline */}
        <AdSense slot={ADSENSE_SLOT} />
      </Layout>

      {/* 9) Floating Ad (Banner rodapé, etc.) */}
      <FloatingAd />
    </AuthProvider>
  );
}
