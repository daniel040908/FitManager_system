import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/relatorios/")({
  head: () => ({ meta: [
    { title: "Relatórios — FitManager" },
    { name: "description", content: "Acompanhe os indicadores da sua academia." },
    { property: "og:title", content: "Relatórios — FitManager" },
    { property: "og:description", content: "Acompanhe os indicadores da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="reports" />,
});
