import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/financeiro/")({
  head: () => ({ meta: [
    { title: "Financeiro — FitManager" },
    { name: "description", content: "Gerencie receitas e despesas da academia." },
    { property: "og:title", content: "Financeiro — FitManager" },
    { property: "og:description", content: "Gerencie receitas e despesas da academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="finance" />,
});
