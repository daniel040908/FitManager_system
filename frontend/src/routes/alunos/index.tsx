import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "../../components/fitmanager";

export const Route = createFileRoute("/alunos/")({
  head: () => ({ meta: [
    { title: "Alunos — FitManager" },
    { name: "description", content: "Gerencie os alunos da sua academia." },
    { property: "og:title", content: "Alunos — FitManager" },
    { property: "og:description", content: "Gerencie os alunos da sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="students" />,
});
