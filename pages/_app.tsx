// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import AdBlock from "@/components/AdBlock";

declare global {
  interface Window {
    // adsbygoogle é injetado pelo script do AdSense
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle?: any[];
  }
}

// Carrega as variáveis de ambiente definidas em .env.local ou Vercel
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT!;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT!;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Carrega JS do Bootstrap só no cliente
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    // Inicializa o array adsbygoogle para o AdSense
    if (typeof window !== "undefined") {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <AuthProvider>
      {/* Meta do AdSense — necessário para validação */}
      <Head>
        <meta
          name="google-adsense-account"
          content={ADSENSE_CLIENT}
        />
      </Head>

      {/* Script global do AdSense */}
      <Script
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />

      <main className="mt-4">
        <Layout>
          {/* Exibe um bloco de anúncio em cada página */}
          <AdBlock slot={ADSENSE_SLOT} />

          {/* Seu conteúdo de página */}
          <Component {...pageProps} />
        </Layout>
      </main>
    </AuthProvider>
  );
}
