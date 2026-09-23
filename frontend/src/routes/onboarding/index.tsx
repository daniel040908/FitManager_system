import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({ meta: [
    { title: "Conheça sua academia — FitManager" },
    { name: "description", content: "Personalize o FitManager com os dados da sua academia." },
    { property: "og:title", content: "Conheça sua academia — FitManager" },
    { property: "og:description", content: "Personalize o FitManager com os dados da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="quiz" />,
});
