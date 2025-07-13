// components/ContentModal.tsx
"use client";

import React, { useEffect } from "react";
import Modal from "./Modal";

type ContentModalProps = {
  title:       string;
  content:     string;
  onClose:     () => void;
  externalUrl?: string | null;
};

export default function ContentModal({
  title,
  content,
  onClose,
  externalUrl,
}: ContentModalProps) {
  // DEBUG: imprime a URL recebida
  useEffect(() => {
    console.log("ContentModal received externalUrl →", externalUrl);
  }, [externalUrl]);

  return (
    <Modal title={title} onClose={onClose}>
      <div
        style={{
          lineHeight: 1.6,
          color: "#333",
          marginBottom: "1rem",  // espaço antes do link
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            color: "#0070f3",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          ▶ Ver notícia completa no site original
        </a>
      )}
      {!externalUrl && (
        <p style={{ fontSize: 12, color: "#666" }}>
          Não há link de fonte original.
        </p>
      )}
    </Modal>
  );
}
