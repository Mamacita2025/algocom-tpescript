// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import AdSense from "@/components/AdSense";
import FloatingAd from "@/components/FloatingAd";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT!;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT!;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />

      <main >
        <Layout>
          <AdSense slot={ADSENSE_SLOT} />
          <Component {...pageProps} />
        </Layout>
      </main>
      <FloatingAd />
    </AuthProvider>
  );
}
