import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "../../components/fitmanager";

export const Route = createFileRoute("/alunos/lista")({
  head: () => ({ meta: [
    { title: "Lista de alunos — FitManager" },
    { name: "description", content: "Consulte os alunos cadastrados na academia." },
    { property: "og:title", content: "Lista de alunos — FitManager" },
    { property: "og:description", content: "Consulte os alunos cadastrados na academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="student-list" />,
});
