// Copy provisória (Fase 2 do plano): revisar antes do lançamento.
import type { ServiceLine } from "./types";

export const automacao: ServiceLine = {
  id: "automacao",
  order: 2,
  content: {
    pt: {
      name: "Automação de processos",
      pain: "O que hoje é planilha e retrabalho vira fluxo automático.",
      headline: "Menos planilha, menos retrabalho, menos erro de digitação.",
      lead: "Mapeamos onde sua equipe perde horas copiando dados entre sistemas e automatizamos esse caminho — com integrações, fluxos e painéis que ficam documentados e com dono.",
      included: [
        {
          title: "Mapeamento do processo",
          text: "Desenhamos como o processo funciona hoje e onde estão o tempo perdido e os erros.",
        },
        {
          title: "Integração entre sistemas",
          text: "ERP, CRM, planilhas, e-mail e APIs conversando sem alguém no meio copiando dados.",
        },
        {
          title: "Fluxos automáticos",
          text: "Aprovações, notificações, geração de documentos e rotinas agendadas.",
        },
        {
          title: "Painéis de controle",
          text: "Os números que hoje saem de planilha manual, atualizados sozinhos.",
        },
        {
          title: "Documentação e treinamento",
          text: "Sua equipe sabe o que foi automatizado, como funciona e o que fazer se algo falhar.",
        },
        {
          title: "Monitoramento",
          text: "Alertas quando um fluxo falha, antes de alguém perceber pelo resultado errado.",
        },
      ],
      steps: [
        {
          name: "Diagnóstico",
          duration: "Até 1 semana",
          text: "Escolhemos o processo com maior ganho e menor risco para começar.",
        },
        {
          name: "Proposta",
          duration: "3 a 5 dias",
          text: "Escopo fechado, prazo e valor por automação.",
        },
        {
          name: "Construção",
          duration: "Por automação",
          text: "Entregas curtas, testadas com dados reais antes de ligar em produção.",
        },
        {
          name: "Acompanhamento",
          duration: "30 dias",
          text: "Ajustes depois da virada e medição do tempo economizado.",
        },
      ],
      excluded: [
        "Licenças das ferramentas de terceiros (indicamos a melhor opção para o seu caso)",
        "Troca do seu ERP ou sistema principal",
        "Automação de processo que ainda não está definido — primeiro ele precisa existir no papel",
      ],
      pricing: {
        title: "Por automação",
        text: "Cada automação tem escopo e valor fechados na proposta. Sustentação mensal opcional para monitoramento e ajustes.",
      },
      faq: [
        {
          q: "Preciso trocar meus sistemas?",
          a: "Quase nunca. O normal é integrar o que você já usa.",
        },
        {
          q: "E se o fluxo automático errar?",
          a: "Todo fluxo tem monitoramento e alerta. O erro aparece para nós antes de virar problema para você.",
        },
        {
          q: "Minha equipe vai conseguir manter?",
          a: "Entregamos documentação e treinamento. Se preferir, a sustentação fica conosco.",
        },
      ],
      seo: {
        title: "Automação de processos empresariais — integrações e fluxos",
        description:
          "Automação de processos, integração entre sistemas e painéis que se atualizam sozinhos. Menos planilha e retrabalho, com escopo e valor fechados.",
      },
    },
    en: {
      name: "Process automation",
      pain: "Spreadsheets and rework become automated flows.",
      headline: "Fewer spreadsheets, less rework, fewer typos.",
      lead: "We find where your team loses hours copying data between systems and automate that path — with integrations, flows and dashboards that are documented and owned.",
      included: [
        {
          title: "Process mapping",
          text: "We map how the process works today and where the time and errors are.",
        },
        {
          title: "System integration",
          text: "ERP, CRM, spreadsheets, e-mail and APIs talking to each other without someone copying data in between.",
        },
        {
          title: "Automated flows",
          text: "Approvals, notifications, document generation and scheduled routines.",
        },
        {
          title: "Dashboards",
          text: "The numbers that today come from manual spreadsheets, updated on their own.",
        },
        {
          title: "Documentation and training",
          text: "Your team knows what was automated, how it works and what to do if it fails.",
        },
        {
          title: "Monitoring",
          text: "Alerts when a flow fails, before someone notices a wrong result.",
        },
      ],
      steps: [
        {
          name: "Diagnosis",
          duration: "Up to 1 week",
          text: "We pick the process with the highest gain and the lowest risk to start.",
        },
        {
          name: "Proposal",
          duration: "3 to 5 days",
          text: "Fixed scope, timeline and price per automation.",
        },
        {
          name: "Build",
          duration: "Per automation",
          text: "Short deliveries, tested with real data before going live.",
        },
        {
          name: "Follow-up",
          duration: "30 days",
          text: "Adjustments after go-live and measurement of the time saved.",
        },
      ],
      excluded: [
        "Third-party tool licenses (we recommend the best option for your case)",
        "Replacing your ERP or core system",
        "Automating a process that is not defined yet — it has to exist on paper first",
      ],
      pricing: {
        title: "Per automation",
        text: "Each automation has a fixed scope and price in the proposal. Optional monthly support for monitoring and adjustments.",
      },
      faq: [
        {
          q: "Do I need to replace my systems?",
          a: "Almost never. The usual path is to integrate what you already use.",
        },
        {
          q: "What if the automated flow fails?",
          a: "Every flow has monitoring and alerts. We see the error before it becomes your problem.",
        },
        {
          q: "Can my team maintain it?",
          a: "We deliver documentation and training. If you prefer, ongoing support stays with us.",
        },
      ],
      seo: {
        title: "Business process automation — integrations and workflows",
        description:
          "Process automation, system integration and self-updating dashboards. Fewer spreadsheets and less rework, with fixed scope and price.",
      },
    },
  },
};
