import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/financeiro/despesas/nova")({
  head: () => ({ meta: [
    { title: "Nova despesa — FitManager" },
    { name: "description", content: "Registre uma nova despesa da academia." },
    { property: "og:title", content: "Nova despesa — FitManager" },
    { property: "og:description", content: "Registre uma nova despesa da academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="expense" />,
});
