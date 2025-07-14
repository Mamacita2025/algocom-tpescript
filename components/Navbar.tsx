// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => router.pathname === href;

  const links = [
    { href: "/",       label: "Home",     icon: "🏠" },
    { href: "/noticias", label: "Notícias", icon: "📰" },
    { href: "/perfil",   label: "Perfil",    icon: "👤" },
    { href: "/sobre",    label: "Sobre",     icon: "📘" },
  ];

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <Image src="/logo.png" alt="PortalNews" width={120} height={32} />
      </Link>

      <button
        className={styles.toggle}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        ☰
      </button>

      <ul className={`${styles.menu} ${open ? styles.menuOpen : ""}`}>
        {links.map(({ href, label, icon }) => (
          <li key={href} className={styles.menuItem}>
            <Link
              href={href}
              className={isActive(href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <span className="me-2 d-inline d-md-none">{icon}</span>
              {label}
            </Link>
          </li>
        ))}

        {user?.role === "admin" && (
          <li className={styles.menuItem}>
            <Link
              href="/admin"
              className={isActive("/admin") ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              🛠️ Admin
            </Link>
          </li>
        )}

        <li className={styles.menuItem}>
          {user ? (
            <div className={styles.auth}>
              <button onClick={() => { logout(); setOpen(false); }}>
                🚪 Sair
              </button>
            </div>
          ) : (
            <div className={styles.auth}>
              <Link href="/login" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                Registrar
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
