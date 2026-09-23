import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/perfil/academia")({
  head: () => ({ meta: [
    { title: "Informações da academia — FitManager" },
    { name: "description", content: "Consulte os dados da sua academia." },
    { property: "og:title", content: "Informações da academia — FitManager" },
    { property: "og:description", content: "Consulte os dados da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="academy" />,
});
