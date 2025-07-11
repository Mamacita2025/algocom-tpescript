// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import AdBlock from "@/components/AdBlock";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle?: any[];
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // só roda no cliente
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    if (typeof window !== "undefined") {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <AuthProvider>
      <main className="mt-4">
        <Layout>      
          <AdBlock slot="SEU_SLOT_ID" />
          <Component {...pageProps} />
        </Layout>
      </main>
    </AuthProvider>
  );
}
