// pages/sobre.tsx

import React from "react";
export default function SobrePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main>
      {/* Hero */}
      <section
        className="text-center text-white"
        style={{
          background:
            "linear-gradient(rgba(0,123,255,0.8), rgba(0,123,255,0.8)), url('/hero-bg.jpg') center/cover no-repeat",
          padding: "6rem 1rem",
        }}
      >
        <h1 className="display-4 fw-bold mb-3">📘 Sobre o MeuPortal</h1>
        <p className="lead mb-4">
          Informação clara, relevante e acessível para você estar sempre bem
          informado.
        </p>
        <a href="#valores" className="btn btn-light btn-lg">
          Conheça nossos valores
        </a>
      </section>

      {/* Missão e Visão */}
      <section className="container py-5">
        <div className="row gy-4">
          <div className="col-md-6">
            <div className="card h-100 border-primary shadow-sm">
              <div className="card-body">
                <h2 className="h4 card-title text-primary">🎯 Missão</h2>
                <p className="card-text">
                  Levar notícias com integridade, promovendo conhecimento,
                  diversidade e diálogo para fortalecer nossa sociedade.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-success shadow-sm">
              <div className="card-body">
                <h2 className="h4 card-title text-success">👁️ Visão</h2>
                <p className="card-text">
                  Ser referência em jornalismo digital independente, com foco em
                  inovação e responsabilidade social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section
        id="valores"
        className="py-5 text-white"
        style={{ backgroundColor: "#0d6efd" }}
      >
        <div className="container">
          <h2 className="h3 text-center mb-4">🌟 Nossos Valores</h2>
          <div className="row gy-4">
            {[
              {
                icon: "🛡️",
                title: "Integridade",
                text: "Checagem rigorosa dos fatos e transparência em cada notícia.",
              },
              {
                icon: "🤝",
                title: "Inclusão",
                text: "Espaço para vozes diversas, respeitando todas as opiniões.",
              },
              {
                icon: "🚀",
                title: "Inovação",
                text: "Tecnologia e criatividade para tornar a informação mais dinâmica.",
              },
            ].map(({ icon, title, text }) => (
              <div className="col-md-4" key={title}>
                <div className="card h-100 bg-white text-dark border-0 shadow">
                  <div className="card-body text-center">
                    <div
                      style={{ fontSize: "2.5rem", lineHeight: 1 }}
                      className="mb-3"
                    >
                      {icon}
                    </div>
                    <h3 className="h5 fw-semibold">{title}</h3>
                    <p className="small">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="container py-5">
        <h2 className="h3 text-center mb-5">👥 Nossa Equipe</h2>
        <div className="row gy-4">
          {[
            {
              name: "Luis",
              role: "Desenvolvedor Full-Stack & Arquiteto Técnico",
              img: "/team/luis.jpg",
            },
            {
              name: "Mariana",
              role: "Editora-Chefe",
              img: "/team/mariana.jpg",
            },
            {
              name: "Rafael",
              role: "Jornalista e Repórter",
              img: "/team/rafael.jpg",
            },
          ].map(({ name, role, img }) => (
            <div className="col-sm-6 col-lg-4" key={name}>
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={img}
                  className="card-img-top"
                  alt={name}
                  style={{ objectFit: "cover", height: "240px" }}
                />
                <div className="card-body text-center">
                  <h3 className="h5 mb-1">{name}</h3>
                  <p className="text-muted small">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="h3 text-center mb-5">📅 Nossa Trajetória</h2>
          <ul className="timeline list-unstyled position-relative">
            {[
              { year: 2020, text: "Fundação do MeuPortal com equipe de 3 pessoas" },
              {
                year: 2021,
                text: "Lançamento do podcast semanal sobre tecnologia",
              },
              {
                year: 2022,
                text: "Cobertura ao vivo de grandes eventos nacionais",
              },
              {
                year: currentYear,
                text: "Expansão de conteúdo e parceria com ONGs",
              },
            ].map(({ year, text }) => (
              <li
                key={year}
                className="d-flex mb-4"
                style={{ alignItems: "flex-start" }}
              >
                <div
                  className="fw-bold text-primary flex-shrink-0"
                  style={{ width: "4rem" }}
                >
                  {year}
                </div>
                <p className="mb-0 small text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center text-white py-5">
        <div
          className="container"
          style={{
            background:
              "linear-gradient(135deg, rgba(40,167,69,0.9), rgba(72,180,97,0.9))",
            borderRadius: "8px",
            padding: "3rem 1rem",
          }}
        >
          <h2 className="h3 mb-3">🚀 Junte-se a nós!</h2>
          <p className="mb-4">
            Seja colaborador, envie sugestões ou apoie nossos projetos de
            jornalismo independente.
          </p>
          <a href="/contato" className="btn btn-light btn-lg">
            Fale Conosco
          </a>
        </div>
      </section>
    </main>
  );
}
