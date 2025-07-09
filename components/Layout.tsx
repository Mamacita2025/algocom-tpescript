import React from "react";
import Navbar from "./Navbar";

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
        flex: 1,
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        {children}
      </main>

      {/* Rodapé */}
      <footer style={{
        textAlign: "center",
        padding: "1rem",
        background: "#f0f0f0",
        fontSize: "14px"
      }}>
        © {new Date().getFullYear()} Todos os direitos reservados.
      </footer>
    </div>
  );
}
