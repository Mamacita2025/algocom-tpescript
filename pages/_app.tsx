// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import AdSense from "@/components/AdSense";
import FloatingAd from "@/components/FloatingAd";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT!;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT!;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(reg => {
          console.log("Service Worker registrado:", reg);
        })
        .catch(err => {
          console.error("Erro ao registrar SW:", err);
        });
    }
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
    if (typeof window !== "undefined") {
      window.adsbygoogle = window.adsbygoogle || [];
    }
  }, []);

  return (
    <AuthProvider>
      <Head>
        <meta
          name="google-adsense-account"
          content={ADSENSE_CLIENT}
        />
        <meta
          name="google-adsense-slot"
          content={ADSENSE_SLOT}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />

        <Layout>
          <Script src="https://fpyf8.com/88/tag.min.js" data-zone="157445" async data-cfasync="false" />

          <Script
            id="propellerads"
            strategy="afterInteractive"
            src="/sw.js"
          />
          <Component {...pageProps} />
          <AdSense slot={ADSENSE_SLOT} />
        </Layout>
      <FloatingAd />
    </AuthProvider>
  );
}
