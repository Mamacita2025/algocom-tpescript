// components/Footer.tsx

import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={brandStyle}>
          <Link href="/" style={logoStyle}>
            📰 PortalNews
          </Link>
          <span style={copyStyle}>© {new Date().getFullYear()} MeuPortal. Todos os direitos reservados.</span>
        </div>
        <div style={socialStyle}>
          <a
            href="https://twitter.com/meuportal"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLink}
          >
            <FaTwitter />
          </a>
          <a
            href="https://facebook.com/meuportal"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLink}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com/meuportal"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLink}
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com/company/meuportal"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLink}
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://github.com/meuportal"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLink}
          >
            <FaGithub />
          </a>
        </div>
      </div>
      <div>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#aaa" }}>
            Desenvolvido por Luis Gomes<br />
          Email: luisgomes.09a@hotmail.com
        </p>
      </div>
    </footer>
  );
}

// ========== styles ==========
const footerStyle: React.CSSProperties = {
  background: "#222",
  color: "#ddd",
  padding: "1.5rem 0",
  fontSize: "0.9rem",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem",
  alignItems: "center",
  justifyContent: "space-between",
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  textAlign: "center" as const,
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#fff",
  textDecoration: "none",
};

const copyStyle: React.CSSProperties = {
  marginTop: "0.25rem",
  color: "#aaa",
};

const socialStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const iconLink: React.CSSProperties = {
  color: "#ddd",
  fontSize: "1.25rem",
  transition: "color 0.2s",
};

