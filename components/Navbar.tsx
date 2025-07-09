import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">📰 MeuPortal</Link>

      <button
        className="navbar-toggler"
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
          <li className="nav-item">
            <Link className="nav-link" href="/">🏠 Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/sobre">📘 Sobre</Link>
          </li>
          {user?.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" href="/admin">🛠️ Administração</Link>
            </li>
          )}
        </ul>

        {user ? (
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.avatar && (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-circle me-2"
                />
              )}
              <span className="d-none d-sm-inline">{user.username}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" href="/perfil">👤 Meu perfil</Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link className="dropdown-item" href="/admin">🛠️ Administração</Link>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={logout}>🚪 Sair</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" href="/login">Entrar</Link>
            <Link className="btn btn-outline-light btn-sm" href="/register">Registrar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
