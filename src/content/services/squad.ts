// Copy provisória (Fase 2 do plano): revisar antes do lançamento.
import type { ServiceLine } from "./types";

export const squad: ServiceLine = {
  id: "squad",
  order: 3,
  content: {
    pt: {
      name: "Squad sob demanda",
      pain: "O roadmap existe; agora existe quem construa.",
      headline: "O time que falta para o seu roadmap sair do papel.",
      lead: "Desenvolvimento de software com um time que se integra ao seu processo: ritmo de entrega, código revisado e documentação desde o primeiro sprint.",
      included: [
        {
          title: "Time montado para o escopo",
          text: "Desenvolvimento, front-end, dados e infraestrutura na medida do que o projeto pede.",
        },
        {
          title: "Integração com o seu time",
          text: "Trabalhamos no seu repositório, nas suas ferramentas e no seu ritual de sprint.",
        },
        {
          title: "Qualidade no processo",
          text: "Code review, testes automatizados e integração contínua desde o início.",
        },
        {
          title: "Visibilidade",
          text: "Demonstração a cada entrega e acesso ao quadro de tarefas.",
        },
        {
          title: "Documentação",
          text: "Decisões de arquitetura e como rodar o projeto, escritas enquanto o código nasce.",
        },
        {
          title: "Passagem de conhecimento",
          text: "Se o seu time assumir depois, a transição é planejada, não improvisada.",
        },
      ],
      steps: [
        {
          name: "Conversa técnica",
          duration: "1 reunião",
          text: "Entendemos o produto, a stack e o que já existe.",
        },
        {
          name: "Proposta",
          duration: "3 a 5 dias",
          text: "Composição do time, ritmo, forma de cobrança e primeiros marcos.",
        },
        {
          name: "Início",
          duration: "1 a 2 semanas",
          text: "Acessos, ambiente e primeiro sprint.",
        },
        {
          name: "Entrega contínua",
          duration: "Por sprint",
          text: "Entregas com demonstração, revisão e métricas de andamento.",
        },
      ],
      excluded: [
        "Alocação de pessoas sem coordenação (entregamos com processo, não horas soltas)",
        "Produto sem um responsável do seu lado para priorizar",
        "Manutenção de sistemas legados sem documentação mínima, sem antes um diagnóstico",
      ],
      pricing: {
        title: "Mensal por composição de time",
        text: "Valor mensal definido pela composição e dedicação do time. Escopo fechado também é possível para projetos bem definidos.",
      },
      faq: [
        {
          q: "Vocês trabalham com a nossa stack?",
          a: "Na maioria dos casos, sim. Se não for o caso, dizemos na conversa técnica — antes de qualquer proposta.",
        },
        {
          q: "O código é nosso?",
          a: "Sim. Código, documentação e acessos ficam com você desde o primeiro commit.",
        },
        {
          q: "Dá para aumentar ou reduzir o time?",
          a: "Sim, com aviso prévio definido em contrato.",
        },
      ],
      seo: {
        title: "Squad de desenvolvimento sob demanda — time de software para o seu roadmap",
        description:
          "Time de desenvolvimento integrado ao seu processo, com code review, testes e documentação desde o primeiro sprint. O código é seu.",
      },
    },
    en: {
      name: "On-demand squad",
      pain: "You have the roadmap; now you have the people to build it.",
      headline: "The team your roadmap is missing.",
      lead: "Software development with a team that plugs into your process: delivery cadence, reviewed code and documentation from the first sprint.",
      included: [
        {
          title: "A team shaped to the scope",
          text: "Back-end, front-end, data and infrastructure, sized to what the project needs.",
        },
        {
          title: "Works inside your team",
          text: "Your repository, your tools and your sprint rituals.",
        },
        {
          title: "Quality built in",
          text: "Code review, automated tests and continuous integration from day one.",
        },
        {
          title: "Visibility",
          text: "A demo at every delivery and access to the task board.",
        },
        {
          title: "Documentation",
          text: "Architecture decisions and how to run the project, written as the code is born.",
        },
        {
          title: "Knowledge transfer",
          text: "If your team takes over later, the handover is planned, not improvised.",
        },
      ],
      steps: [
        {
          name: "Technical conversation",
          duration: "1 meeting",
          text: "We learn the product, the stack and what already exists.",
        },
        {
          name: "Proposal",
          duration: "3 to 5 days",
          text: "Team composition, cadence, pricing model and first milestones.",
        },
        {
          name: "Kick-off",
          duration: "1 to 2 weeks",
          text: "Access, environment and first sprint.",
        },
        {
          name: "Continuous delivery",
          duration: "Per sprint",
          text: "Deliveries with demos, reviews and progress metrics.",
        },
      ],
      excluded: [
        "Staff allocation without coordination (we deliver with a process, not loose hours)",
        "A product with nobody on your side to prioritize",
        "Maintaining legacy systems with no documentation at all, without an assessment first",
      ],
      pricing: {
        title: "Monthly, by team composition",
        text: "A monthly fee set by team composition and allocation. Fixed scope is also possible for well-defined projects.",
      },
      faq: [
        {
          q: "Do you work with our stack?",
          a: "In most cases, yes. If not, we say so in the technical conversation — before any proposal.",
        },
        {
          q: "Who owns the code?",
          a: "You do. Code, documentation and access are yours from the first commit.",
        },
        {
          q: "Can the team grow or shrink?",
          a: "Yes, with notice periods defined in the contract.",
        },
      ],
      seo: {
        title: "On-demand software development squad for your roadmap",
        description:
          "A development team that plugs into your process, with code review, tests and documentation from the first sprint. You own the code.",
      },
    },
  },
};
