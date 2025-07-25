import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navegação principal */}
      <Navbar />

      {/* Conteúdo da página */}
      <main style={{
       
      }}>
        {children}
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
