import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/frequencia")({
  head: () => ({ meta: [
    { title: "Frequência — FitManager" },
    { name: "description", content: "Acompanhe a frequência dos alunos." },
    { property: "og:title", content: "Frequência — FitManager" },
    { property: "og:description", content: "Acompanhe a frequência dos alunos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="attendance" />,
});
