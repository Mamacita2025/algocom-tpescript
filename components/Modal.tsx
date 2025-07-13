// components/Modal.tsx
"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  title?:   string;
  children: ReactNode;
  onClose:  () => void;
};

export default function Modal({ title, children, onClose }: ModalProps) {
  // cria a ref com valor inicial null
  const elRef = useRef<HTMLDivElement | null>(null);

  // no primeiro render, cria a div apenas uma vez
  if (elRef.current === null) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const el = elRef.current!;

    document.body.appendChild(el);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.removeChild(el);
      document.body.style.overflow = "";
    };
  }, []);

  const modalContent = (
    <div style={backdrop} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        <div>{children}</div>
        <button onClick={onClose} style={closeBtn}>
          Fechar
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, elRef.current!);
}

const backdrop: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: 6,
  width: "90%",
  maxWidth: 600,
  maxHeight: "80%",
  overflowY: "auto",
};

const closeBtn: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
