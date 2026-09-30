// Copy provisória (Fase 2 do plano): revisar antes do lançamento.
import type { ServiceLine } from "./types";

export const tiGerenciada: ServiceLine = {
  id: "ti-gerenciada",
  order: 1,
  content: {
    pt: {
      name: "T.I. gerenciada",
      pain: "Quando algo cai, você sabe exatamente a quem ligar.",
      headline: "Sua T.I. com dono, prazo de resposta e relatório.",
      lead: "Suporte, infraestrutura e segurança sob um contrato recorrente, com SLA escrito. Você para de apagar incêndio e passa a saber o que está acontecendo no seu ambiente.",
      included: [
        {
          title: "Suporte aos usuários",
          text: "Atendimento por chamado, com prioridade definida e prazo de resposta no contrato.",
        },
        {
          title: "Infraestrutura e nuvem",
          text: "Servidores, rede, backups e serviços em nuvem monitorados e mantidos.",
        },
        {
          title: "Segurança básica bem feita",
          text: "Atualizações, antivírus gerenciado, controle de acessos e política de senhas.",
        },
        {
          title: "Inventário e documentação",
          text: "Você sabe quais equipamentos, licenças e acessos existem — e quem tem cada um.",
        },
        {
          title: "Relatório mensal",
          text: "Chamados, incidentes, o que foi feito e o que recomendamos para o próximo mês.",
        },
        {
          title: "Um responsável",
          text: "Uma pessoa que conhece o seu histórico e responde pelo contrato.",
        },
      ],
      steps: [
        {
          name: "Diagnóstico do ambiente",
          duration: "Até 1 semana",
          text: "Levantamos equipamentos, sistemas, acessos e riscos.",
        },
        {
          name: "Proposta e SLA",
          duration: "3 a 5 dias",
          text: "Escopo, prazos de resposta por prioridade e mensalidade.",
        },
        {
          name: "Transição",
          duration: "2 a 4 semanas",
          text: "Documentamos o ambiente e assumimos o suporte sem parar a operação.",
        },
        {
          name: "Operação contínua",
          duration: "Mensal",
          text: "Suporte, monitoramento e relatório todo mês.",
        },
      ],
      excluded: [
        "Compra de equipamentos e licenças (indicamos e cotamos, a compra é sua)",
        "Desenvolvimento de sistemas sob medida (é a linha Squad sob demanda)",
        "Atendimento presencial fora da região combinada em contrato",
      ],
      pricing: {
        title: "Mensalidade fixa",
        text: "Valor mensal definido pelo tamanho do ambiente e pelo SLA escolhido. Sem cobrança por chamado dentro do escopo.",
      },
      faq: [
        {
          q: "Vocês substituem nosso técnico interno?",
          a: "Podem substituir ou trabalhar junto. Muitas empresas mantêm alguém interno e usam o contrato para infraestrutura, segurança e cobertura de férias.",
        },
        {
          q: "O que acontece fora do horário comercial?",
          a: "Depende do SLA contratado. Incidentes críticos podem ter atendimento estendido; isso fica escrito na proposta.",
        },
        {
          q: "Precisamos trocar nossos equipamentos?",
          a: "Não para começar. O diagnóstico aponta o que tem risco real e o que pode esperar.",
        },
      ],
      seo: {
        title: "T.I. gerenciada para empresas — suporte, infraestrutura e segurança",
        description:
          "Suporte de T.I., infraestrutura e segurança sob contrato recorrente com SLA escrito e relatório mensal. Um responsável pelo seu ambiente.",
      },
    },
    en: {
      name: "Managed IT",
      pain: "When something breaks, you know exactly who to call.",
      headline: "IT with an owner, a response time and a report.",
      lead: "Support, infrastructure and security under a recurring contract with a written SLA. You stop firefighting and start knowing what is happening in your environment.",
      included: [
        {
          title: "User support",
          text: "Ticket-based support, with defined priorities and response times in the contract.",
        },
        {
          title: "Infrastructure and cloud",
          text: "Servers, network, backups and cloud services, monitored and maintained.",
        },
        {
          title: "Security basics done right",
          text: "Updates, managed antivirus, access control and password policy.",
        },
        {
          title: "Inventory and documentation",
          text: "You know which devices, licenses and accesses exist — and who holds each one.",
        },
        {
          title: "Monthly report",
          text: "Tickets, incidents, what was done and what we recommend next.",
        },
        {
          title: "One accountable person",
          text: "Someone who knows your history and answers for the contract.",
        },
      ],
      steps: [
        {
          name: "Environment assessment",
          duration: "Up to 1 week",
          text: "We map devices, systems, accesses and risks.",
        },
        {
          name: "Proposal and SLA",
          duration: "3 to 5 days",
          text: "Scope, response times by priority and monthly fee.",
        },
        {
          name: "Transition",
          duration: "2 to 4 weeks",
          text: "We document the environment and take over support without stopping operations.",
        },
        {
          name: "Ongoing operation",
          duration: "Monthly",
          text: "Support, monitoring and a report every month.",
        },
      ],
      excluded: [
        "Purchasing hardware and licenses (we recommend and quote, you buy)",
        "Custom software development (that is the On-demand squad line)",
        "On-site support outside the region agreed in the contract",
      ],
      pricing: {
        title: "Fixed monthly fee",
        text: "A monthly fee set by the size of the environment and the chosen SLA. No per-ticket charges within scope.",
      },
      faq: [
        {
          q: "Do you replace our in-house technician?",
          a: "You can replace or complement them. Many companies keep someone in-house and use the contract for infrastructure, security and vacation coverage.",
        },
        {
          q: "What happens outside business hours?",
          a: "It depends on the SLA. Critical incidents can have extended coverage; the proposal spells it out.",
        },
        {
          q: "Do we need to replace our hardware?",
          a: "Not to get started. The assessment shows what is a real risk and what can wait.",
        },
      ],
      seo: {
        title: "Managed IT for companies — support, infrastructure and security",
        description:
          "IT support, infrastructure and security under a recurring contract with a written SLA and a monthly report. One accountable person for your environment.",
      },
    },
  },
};
