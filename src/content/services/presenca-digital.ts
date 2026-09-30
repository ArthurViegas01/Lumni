// Copy provisória (Fase 2 do plano): revisar antes do lançamento.
// Só em português: serviço local (plano, seção 2.1). Faixa de preço pendente (P12).
import type { ServiceLine } from "./types";

export const presencaDigital: ServiceLine = {
  id: "presenca-digital",
  order: 4,
  content: {
    pt: {
      name: "Presença digital",
      pain: "Um site que traz cliente em vez de só existir.",
      headline: "Um site rápido, encontrável e que gera contato.",
      lead: "Sites institucionais e páginas de serviço feitos para aparecer no Google da sua região, carregar rápido no celular e transformar visita em conversa.",
      included: [
        {
          title: "Estrutura pensada para busca local",
          text: "Páginas por serviço, dados estruturados e perfil no Google alinhados.",
        },
        {
          title: "Rápido no celular",
          text: "Carregamento abaixo de 2 segundos em conexão móvel como meta de entrega.",
        },
        {
          title: "Formulário que qualifica",
          text: "O contato chega com as informações que você precisa para responder.",
        },
        {
          title: "Textos revisados",
          text: "Ajudamos a transformar o que você faz em texto que o cliente entende.",
        },
        {
          title: "Você consegue atualizar",
          text: "Edição simples do que muda com frequência, sem depender de nós.",
        },
        {
          title: "Métricas sem cookie invasivo",
          text: "Visitas, origem e contatos medidos sem banner de cookies atrapalhando.",
        },
      ],
      steps: [
        {
          name: "Conversa",
          duration: "1 reunião",
          text: "Objetivo do site, público e o que você já tem.",
        },
        {
          name: "Proposta",
          duration: "2 a 3 dias",
          text: "Páginas, prazo e valor fechados.",
        },
        {
          name: "Criação",
          duration: "2 a 4 semanas",
          text: "Layout, textos e desenvolvimento, com uma rodada de ajustes por etapa.",
        },
        {
          name: "Publicação",
          duration: "1 semana",
          text: "Domínio, perfil no Google, métricas e treinamento de edição.",
        },
      ],
      excluded: [
        "Loja virtual com estoque e pagamentos (avaliamos à parte)",
        "Produção de fotos e vídeos profissionais",
        "Gestão de anúncios pagos e redes sociais",
      ],
      pricing: {
        title: "Projeto com valor fechado",
        text: "Valor fechado por projeto, definido pelo número de páginas. Hospedagem e manutenção mensal opcionais.",
      },
      faq: [
        {
          q: "Em quanto tempo o site fica pronto?",
          a: "Um site institucional típico leva de 3 a 6 semanas, dependendo de quanto do conteúdo já existe.",
        },
        {
          q: "O domínio e o site são meus?",
          a: "Sim. Domínio, conteúdo e código ficam no seu nome.",
        },
        {
          q: "Vocês garantem primeira posição no Google?",
          a: "Ninguém pode garantir isso honestamente. Garantimos a estrutura técnica certa e um site rápido — o resto depende de conteúdo e tempo.",
        },
      ],
      seo: {
        title: "Criação de site para empresas em Porto Alegre — rápido e encontrável",
        description:
          "Sites institucionais rápidos no celular, pensados para busca local e para gerar contato. Valor fechado, domínio e código no seu nome.",
      },
    },
  },
};
