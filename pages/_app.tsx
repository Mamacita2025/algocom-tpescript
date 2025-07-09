import type { AppProps } from "next/app";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <AuthProvider>
      <main className=" mt-4">
        <Layout>
          <Component {...pageProps} className='container' />
        </Layout>
      </main>
    </AuthProvider>
  );
}

