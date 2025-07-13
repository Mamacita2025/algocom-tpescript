// pages/politica-privacidade.tsx
import Head from "next/head";
import Link from "next/link";

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | PortalNews</title>
        <meta
          name="description"
          content="Política de Privacidade do PortalNews: como coletamos, usamos e protegemos seus dados."
        />
      </Head>

      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <h1>Política de Privacidade</h1>

        <p>
          Bem-vindo à Política de Privacidade do PortalNews. Aqui explicamos
          como coletamos, usamos, armazenamos e compartilhamos os seus dados
          quando você acessa nosso site ou utiliza nossos serviços.
        </p>

        <h2>1. Quem é o controlador dos dados?</h2>
        <p>
          Os dados coletados pelo PortalNews são controlados por{" "}
          <strong>Nome da Sua Empresa Ltda.</strong>, com sede em Rua Exemplo,
          123, Cidade, País. Se tiver dúvidas ou quiser exercer seus direitos
          sobre seus dados, entre em contato pelo e-mail{" "}
          <a href="luisgomes.09a@hotmail.com">
            luisgomes.09a@hotmail.com
          </a>
          .
        </p>

        <h2>2. Quais dados coletamos?</h2>
        <ul>
          <li>
            Cadastro de usuário: nome, e-mail, senha (criptografada), avatar e
            função (role).
          </li>
          <li>
            Conteúdo gerado: comentários, preferências de notícias e histórico de
            leitura.
          </li>
          <li>
            Dados técnicos: endereço IP, tipo de dispositivo, navegador e
            sistema operacional.
          </li>
          <li>
            Cookies e localStorage: para manter você autenticado,
            personalizar conteúdos e coletar métricas de uso.
          </li>
          <li>
            Métricas de anúncio: eventos de reprodução de vídeos patrocinados
            (milestones e skips) para medições de visualização.
          </li>
        </ul>

        <h2>3. Como usamos seus dados?</h2>
        <ul>
          <li>
            Autenticar e autorizar acesso a áreas restritas (login e sessão).
          </li>
          <li>
            Exibir conteúdo personalizado e sugestões de notícias conforme seu
            interesse.
          </li>
          <li>
            Melhorar e otimizar a plataforma, realizando análises de uso e
            desempenho.
          </li>
          <li>
            Exibir anúncios relevantes e calcular métricas de performance e
            faturamento.
          </li>
          <li>
            Enviar comunicações de serviço, atualizações e eventuais
            notificações.
          </li>
        </ul>

        <h2>4. Compartilhamento e terceiros</h2>
        <p>
          Podemos compartilhar seus dados com:
        </p>
        <ul>
          <li>
            Serviços de hospedagem e banco de dados (ex.: MongoDB Atlas,
            Vercel).
          </li>
          <li>
            Plataformas de anúncios (ex.: Google AdSense) e player de vídeo
            (Video.js).
          </li>
          <li>
            Ferramentas de análise anônima (Google Analytics, Metabase, Grafana).
          </li>
          <li>
            Autoridades legais caso haja requisição judicial ou para cumprir
            obrigações legais.
          </li>
        </ul>

        <h2>5. Cookies e tecnologias similares</h2>
        <p>
          Utilizamos cookies e localStorage para:
        </p>
        <ul>
          <li>Manter você logado durante a navegação.</li>
          <li>
            Armazenar preferências de layout, idioma e interesses de conteúdo.
          </li>
          <li>
            Rastrear métricas de uso e performance de vídeos patrocinados.
          </li>
        </ul>
        <p>
          Você pode gerenciar ou desativar cookies diretamente nas configurações
          do seu navegador, mas alguns recursos da plataforma podem deixar de
          funcionar corretamente.
        </p>

        <h2>6. Seus direitos</h2>
        <p>Você pode, a qualquer momento:</p>
        <ul>
          <li>Solicitar acesso aos seus dados pessoais.</li>
          <li>Corrigir dados incorretos ou desatualizados.</li>
          <li>Excluir sua conta e dados associados.</li>
          <li>Solicitar a portabilidade dos seus dados.</li>
          <li>Revogar seu consentimento ao processamento em determinadas bases.</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato por e-mail:
          <a href="luisgomes.09a@hotmail.com">
            luisgomes.09a@hotmail.com
          </a>
          .
        </p>

        <h2>7. Segurança dos dados</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados
          contra acesso não autorizado, perda, alteração ou destruição. Utilizamos
          conexões HTTPS, criptografia de senha e práticas de segurança em
          bibliotecas e serviços utilizados.
        </p>

        <h2>8. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Toda
          nova versão será publicada nesta página com data de última revisão.
          Recomendamos que você a consulte regularmente.
        </p>
        <p>
          Última atualização: 05 de Julho de 2025.
        </p>

        <h2>9. Links para outras páginas</h2>
        <p>
          Para voltar à página inicial, clique{" "}
          <Link href="/">aqui</Link>.
        </p>
      </main>
    </>
  );
}
