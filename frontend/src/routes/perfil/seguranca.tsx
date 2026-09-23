import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/perfil/seguranca")({
  head: () => ({ meta: [
    { title: "Segurança da conta — FitManager" },
    { name: "description", content: "Gerencie a segurança da sua conta." },
    { property: "og:title", content: "Segurança da conta — FitManager" },
    { property: "og:description", content: "Gerencie a segurança da sua conta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="security" />,
});
