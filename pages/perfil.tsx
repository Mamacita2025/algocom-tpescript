import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

export default function PerfilPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [errors, setErrors] = useState<{ username?: string; avatar?: string }>(
    {}
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<{
    likes: any[];
    comments: any[];
  } | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    };
    fetchActivity();
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!username || username.trim().length < 3) {
      newErrors.username = "O nome deve ter pelo menos 3 caracteres.";
    }

    if (avatar && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(avatar)) {
      newErrors.avatar = "URL inválida de imagem (jpg, png, webp).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, avatar }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar dados.");

      setSuccess(true);
    } catch {
      setErrors({ username: "Erro ao salvar. Tente novamente mais tarde." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <h1 className="mb-4">👤 Meu Perfil</h1>
        <div className="alert alert-warning">
          🔐 Você precisa estar logado para acessar esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">👤 Meu Perfil</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
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
          <div className="invalid-feedback">{errors.username}</div>
          <small className="form-text text-muted">
            Seu nome será exibido publicamente no portal.
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar (URL)</label>
          <input
            type="url"
            className={`form-control ${
              errors.avatar ? "is-invalid" : avatar ? "is-valid" : ""
            }`}
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            onBlur={validate}
          />
          <div className="invalid-feedback">{errors.avatar}</div>
          <small className="form-text text-muted">
            Insira uma URL de imagem válida, como{" "}
            <em>https://meusite.com/avatar.png</em>.
          </small>
        </div>

        {activity && (
          <div className="mt-5">
            <h2>💬 Comentários feitos</h2>
            <ul className="list-group mb-4">
              {activity.comments.map((c) => (
                <li key={c._id} className="list-group-item">
                  <strong>{c.newsId.title}</strong>: {c.text}
                  <Link href={`/news/${c.newsId._id}`} className="ms-2">
                    Ver notícia
                  </Link>
                </li>
              ))}
            </ul>

            <h2>👍 Notícias curtidas</h2>
            <ul className="list-group">
              {activity.likes.map((l) => (
                <li key={l._id} className="list-group-item">
                  <strong>{l.newsId.title}</strong>
                  <Link href={`/news/${l.newsId._id}`} className="ms-2">
                    Ver notícia
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {avatar && !errors.avatar && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-3"
          >
            <Image
              src={avatar}
              alt="Preview do avatar"
              width={64}
              height={64}
              className="rounded-circle"
            />
          </motion.div>
        )}

        <button
          type="submit"
          className={`btn ${success ? "btn-success" : "btn-primary"}`}
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading
            ? "Salvando..."
            : success
            ? "✔️ Salvo!"
            : "Salvar alterações"}
        </button>

        <AnimatePresence>
          {success && (
            <motion.div
              className="alert alert-success mt-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              ✅ Perfil atualizado com sucesso!
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
