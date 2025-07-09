export default function SobrePage() {
  return (
    <div className="container py-5">
      <section className="mb-5 text-center">
        <h1 className="display-4 fw-bold">📘 Sobre o MeuPortal</h1>
        <p className="lead text-muted">
          Somos uma plataforma dedicada à informação clara, relevante e acessível para todos.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h4 fw-semibold">🎯 Missão</h2>
        <p>
          Levar notícias com integridade, promovendo conhecimento, diversidade e diálogo na sociedade.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h4 fw-semibold">👁️ Visão</h2>
        <p>
          Ser referência em jornalismo digital independente, com foco em inovação e responsabilidade social.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h4 fw-semibold">🧠 Quem somos</h2>
        <ul className="list-unstyled">
          <li><strong>Luis:</strong> Desenvolvedor full-stack e arquiteto técnico do portal</li>
          {/* Podes adicionar outros membros aqui se quiser */}
        </ul>
      </section>

      <section className="text-center">
        <p className="text-muted">
          Fundado em {new Date().getFullYear()}, o MeuPortal evolui com a colaboração dos usuários e desenvolvedores apaixonados por tecnologia e verdade.
        </p>
      </section>
    </div>
  );
}
