"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Activity = {
  _id: string;
  text?: string;
  newsId?: { _id: string; title: string };
  title?: string;
};

export default function PerfilPage() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [errors, setErrors] = useState<{ username?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<{
    likes: Activity[];
    comments: Activity[];
  } | null>(null);

  useEffect(() => {
    async function loadActivity() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/user/activity", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setActivity(await res.json());
    }
    loadActivity();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!username.trim() || username.trim().length < 3) {
      errs.username = "Nome deve ter ao menos 3 caracteres.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token ausente.");

      const formData = new FormData();
      formData.append("username", username.trim());
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/user/update", {
        method: "PUT",
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao atualizar.");

      // atualiza contexto e feedback
      setUser(json.user);
      setSuccess(true);
      setErrors({});
    } catch (err: any) {
      setErrors({ username: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <h1 className="mb-4">👤 Meu Perfil</h1>
        <div className="alert alert-warning">
          Você precisa estar logado para acessar esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">👤 Meu Perfil</h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        {/* Nome */}
        <div className="mb-4">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className={`form-control ${
              errors.username ? "is-invalid" : username ? "is-valid" : ""
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validate}
            required
          />
          <div className="invalid-feedback">
            {errors.username}
          </div>
          <div className="form-text">
            Nome público exibido no portal.
          </div>
        </div>

        {/* Avatar */}
        <div className="mb-4">
          <label className="form-label">Avatar (arquivo)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview */}
        <AnimatePresence>
          {avatarPreview && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 text-center"
            >
              <Image
                src={avatarPreview}
                alt="Preview do avatar"
                width={96}
                height={96}
                className="rounded-circle border"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className={`btn ${
            success ? "btn-success" : "btn-primary"
          } mb-4`}
          disabled={loading}
        >
          {loading
            ? "Salvando..."
            : success
            ? "✔️ Salvo!"
            : "Salvar Alterações"}
        </button>

        {/* Atividade */}
        {activity && (
          <section>
            <h2>💬 Seus Comentários</h2>
            <ul className="list-group mb-4">
              {activity.comments.length ? (
                activity.comments.map((c) =>
                  c.newsId ? (
                    <li
                      key={c._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{c.newsId.title}:</strong> {c.text}
                      </div>
                      <Link
                        href={`/noticia/${c.newsId._id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Ver notícia
                      </Link>
                    </li>
                  ) : null
                )
              ) : (
                <li className="list-group-item">
                  — Você não fez comentários ainda.
                </li>
              )}
            </ul>

            <h2>👍 Notícias Curtidas</h2>
            <ul className="list-group">
              {activity.likes.length ? (
                activity.likes.map((l) => (
                  <li
                    key={l._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{l.title}</span>
                    <Link
                      href={`/noticia/${l._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver notícia
                    </Link>
                  </li>
                ))
              ) : (
                <li className="list-group-item">
                  — Você não curtiu nenhuma notícia ainda.
                </li>
              )}
            </ul>
          </section>
        )}
      </form>
    </div>
  );
}
