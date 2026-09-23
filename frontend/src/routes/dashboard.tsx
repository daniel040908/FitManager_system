import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — FitManager" },
    { name: "description", content: "Visão geral da sua academia no FitManager." },
    { property: "og:title", content: "Dashboard — FitManager" },
    { property: "og:description", content: "Visão geral da sua academia no FitManager." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="dashboard" />,
});
