import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/onboarding/pronto")({
  head: () => ({ meta: [
    { title: "Cadastro concluído — FitManager" },
    { name: "description", content: "Revise e finalize o cadastro da sua academia." },
    { property: "og:title", content: "Cadastro concluído — FitManager" },
    { property: "og:description", content: "Revise e finalize o cadastro da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="ready" />,
});
