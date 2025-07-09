import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  newsId: string;
  likedBy: string[]; // Array de userIds
  initialLikes: number;
};

export default function LikeButton({ newsId, likedBy, initialLikes }: Props) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && likedBy.includes(user.userId)) {
      setHasLiked(true);
    }
  }, [user, likedBy]);

  const handleLike = async () => {
    if (!user || loading || hasLiked) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${newsId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch {
      console.error("Erro ao curtir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-outline-danger btn-sm"
      disabled={loading || hasLiked || !user}
      onClick={handleLike}
    >
      {hasLiked ? "❤️ Curtido" : "🤍 Curtir"} ({likes})
    </button>
  );
}
