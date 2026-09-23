import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Crie sua conta — FitManager" },
    { name: "description", content: "Crie sua conta no FitManager e comece a gerenciar sua academia." },
    { property: "og:title", content: "Crie sua conta — FitManager" },
    { property: "og:description", content: "Crie sua conta no FitManager e comece a gerenciar sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="signup" />,
});
