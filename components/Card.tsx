import React from "react";
import Link from "next/link";

type CardProps = {
  title:    string;
  excerpt?: string;
  imageUrl?:string;
  href?:    string;            // se definido, faz <Link>
  onClick?: () => void;        // senão, faz onclick
};

export default function Card({
  title,
  excerpt,
  imageUrl,
  href,
  onClick
}: CardProps) {
  const content = (
    <div style={wrapper}>
      {imageUrl && <img src={imageUrl} alt={title} style={img} />}
      <h3 style={titleStyle}>{title}</h3>
      {excerpt && <p style={excerptStyle}>{excerpt}</p>}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <a style={{ textDecoration: "none" }}>{content}</a>
      </Link>
    );
  }
  return <div onClick={onClick} style={{ cursor: "pointer" }}>{content}</div>;
}

const wrapper: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: "1rem",
  background: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  transition: "transform 0.1s",
  maxWidth: 300
};

const img: React.CSSProperties = {
  width: "100%",
  borderRadius: "4px 4px 0 0",
  objectFit: "cover",
  height: 150
};

const titleStyle: React.CSSProperties = {
  margin: "0.5rem 0",
  fontSize: "1.1rem",
  color: "#333"
};

const excerptStyle: React.CSSProperties = {
  margin: 0,
  color: "#666",
  fontSize: "0.9rem"
};
