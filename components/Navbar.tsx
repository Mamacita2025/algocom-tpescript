/* eslint-disable @next/next/no-img-element */
// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";     // ← Pages Router usa next/router
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // helper para marcar o link ativo
  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
          <Link
        href="/"
        style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <img
          src="/logo.png"
          alt="PortalNews"
          width={160}
          height={40}
          
          style={{ maxHeight: "40px", borderRadius: "5px" }}
        />
      </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[
              { href: "/", label: "Home", icon: "🏠" },
              { href: "/noticias", label: "Notícias", icon: "📰" },
              { href: "/perfil", label: "Perfil", icon: "👤" },
              { href: "/sobre", label: "Sobre", icon: "📘" },
            ].map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={
                    "nav-link d-flex align-items-center " +
                    (isActive(item.href) ? "active fw-semibold" : "")
                  }
                >
                  <span className="d-lg-none">{item.icon}</span>
                  <span className="ms-1">{item.label}</span>
                </Link>
              </li>
            ))}

            {user?.role === "admin" && (
              <li className="nav-item">
                <Link
                  href="/admin"
                  className={
                    "nav-link d-flex align-items-center " +
                    (isActive("/admin") ? "active fw-semibold" : "")
                  }
                >
                  <span className="d-lg-none">🛠️</span>
                  <span className="ms-1">Admin</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-circle"
                      unoptimized
                    />
                  ) : (
                    <span className="fs-4 me-2">👤</span>
                  )}
                  <span className="ms-2 d-none d-sm-inline">
                    {user.username}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end mt-2 shadow-sm">
                  <li>
                    <Link href="/perfil" className="dropdown-item">
                      👤 Meu Perfil
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link href="/admin" className="dropdown-item">
                        🛠️ Administração
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      🚪 Sair
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-outline-light btn-sm me-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="btn btn-light btn-sm text-primary"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
