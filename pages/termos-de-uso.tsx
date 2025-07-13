// pages/termos-de-uso.tsx
import Head from "next/head";
import Link from "next/link";

export default function TermosDeUso() {
  return (
    <>
      <Head>
        <title>Termos de Uso | PortalNews</title>
        <meta
          name="description"
          content="Termos de Uso do PortalNews: regras e condições para uso da plataforma."
        />
      </Head>

      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <h1>Termos de Uso</h1>

        <p>
          Estes Termos de Uso regem sua utilização do site e dos serviços do{" "}
          <strong>PortalNews</strong>. Ao acessar ou usar nossa plataforma,
          você concorda com estas condições. Caso não concorde, por favor não
          use nossos serviços.
        </p>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao registrar-se ou navegar em nosso site, você declara ter lido,
          compreendido e aceitado estes Termos de Uso, bem como quaisquer
          alterações futuras que venham a ser publicadas.
        </p>

        <h2>2. Cadastro e Segurança</h2>
        <ul>
          <li>
            Você é responsável por fornecer dados verdadeiros e manter suas
            credenciais em sigilo.
          </li>
          <li>
            Qualquer atividade realizada com seu login é de sua inteira
            responsabilidade.
          </li>
          <li>
            Informe-nos imediatamente sobre qualquer uso não autorizado de sua
            conta.
          </li>
        </ul>

        <h2>3. Uso Permitido</h2>
        <p>
          Você pode usar nosso site para consumir conteúdo, postar comentários
          e interagir com recursos autorizados pelo seu nível de acesso. É
          proibido:
        </p>
        <ul>
          <li>Publicar conteúdo ilegal, ofensivo ou difamatório.</li>
          <li>Praticar pirataria, scraping ou automações não autorizadas.</li>
          <li>Interferir ou comprometer a segurança da plataforma.</li>
        </ul>

        <h2>4. Propriedade Intelectual</h2>
        <p>
          Todo texto, imagem, vídeo, layout, código e design do
          <strong> PortalNews</strong> são protegidos por direitos autorais e
          são de nossa propriedade ou de terceiros licenciantes. É proibido
          copiar, distribuir ou criar trabalhos derivados sem autorização.
        </p>

        <h2>5. Conteúdo de Usuário</h2>
        <p>
          Você mantém os direitos sobre o conteúdo que publica, mas nos concede
          uma licença não exclusiva, mundial e livre de royalties para exibi-lo,
          reproduzi-lo e distribuí-lo em nossa plataforma.
        </p>

        <h2>6. Anúncios e Monetização</h2>
        <p>
          Nosso site pode exibir anúncios, incluindo vídeos patrocinados. Você
          concorda que não seremos responsáveis por produtos ou serviços
          anunciados por terceiros.
        </p>

        <h2>7. Modificações no Serviço</h2>
        <p>
          Podemos alterar, suspender ou descontinuar qualquer funcionalidade a
          qualquer momento, sem aviso prévio. Continuar usando o site após
          modificações constitui aceitação das novas condições.
        </p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>
          Em nenhuma hipótese seremos responsáveis por danos diretos, indiretos,
          incidentais, especiais ou consequenciais decorrentes do uso ou da
          incapacidade de usar nosso serviço.
        </p>

        <h2>9. Renúncia de Garantias</h2>
        <p>
          O site é fornecido “como está” e “conforme disponível”, sem garantias
          expressas ou implícitas. Não garantimos que o serviço será ininterrupto,
          livre de erros ou seguro.
        </p>

        <h2>10. Vigência e Rescisão</h2>
        <p>
          Estes Termos permanecem em vigor enquanto você usar nossos serviços.
          Podemos suspender ou encerrar seu acesso a qualquer momento, sem
          aviso, caso viole estas condições.
        </p>

        <h2>11. Legislação Aplicável</h2>
        <p>
          Estes Termos são regidos pelas leis da sua jurisdição, sem conflito
          entre princípios de direito internacional.
        </p>

        <h2>12. Contato</h2>
        <p>
          Em caso de dúvidas ou solicitações, entre em contato pelo e-mail{" "}
          <a href="luisgomes.09a@hotmail.com">
            luisgomes.09a@hotmail.com
          </a>
          .
        </p>

        <h2>13. Alterações destes Termos</h2>
        <p>
          Podemos revisar estes Termos periodicamente. Toda versão será
          publicada nesta página com data de última atualização.
        </p>
        <p>Última atualização: 05 de Julho de 2025.</p>

        <p>
          Voltar ao <Link href="/">Início</Link>
        </p>
      </main>
    </>
  );
}
