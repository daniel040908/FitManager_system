import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "../../components/fitmanager";

export const Route = createFileRoute("/alunos/novo")({
  head: () => ({ meta: [
    { title: "Cadastrar aluno — FitManager" },
    { name: "description", content: "Cadastre um novo aluno na sua academia." },
    { property: "og:title", content: "Cadastrar aluno — FitManager" },
    { property: "og:description", content: "Cadastre um novo aluno na sua academia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="new-student" />,
});
