import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  style?: React.CSSProperties;
};

const variants = {
  primary: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none"
  },
  secondary: {
    backgroundColor: "#eaeaea",
    color: "#000",
    border: "1px solid #ccc"
  }
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  style
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ 
        padding: "0.5rem 1rem",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: "1rem",
        ...variants[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}
