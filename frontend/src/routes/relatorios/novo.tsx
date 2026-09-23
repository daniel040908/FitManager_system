import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/relatorios/novo")({
  head: () => ({ meta: [
    { title: "Novo relatório — FitManager" },
    { name: "description", content: "Crie um relatório da sua academia." },
    { property: "og:title", content: "Novo relatório — FitManager" },
    { property: "og:description", content: "Crie um relatório da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="new-report" />,
});
