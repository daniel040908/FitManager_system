import { createFileRoute } from "@tanstack/react-router";
import { FitManagerPage } from "@/components/fitmanager";

export const Route = createFileRoute("/perfil/")({
  head: () => ({ meta: [
    { title: "Perfil — FitManager" },
    { name: "description", content: "Consulte e edite seu perfil no FitManager." },
    { property: "og:title", content: "Perfil — FitManager" },
    { property: "og:description", content: "Consulte e edite seu perfil no FitManager." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FitManagerPage screen="profile" />,
});
