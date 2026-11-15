import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/resource-manager";
import { resourceConfigs } from "@/lib/admin/config";

export default async function ResourcePage({ params }: PageProps<"/admin/[resource]">) {
  const { resource } = await params;
  const cfg = resourceConfigs[resource];
  if (!cfg) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{cfg.label}</h1>
      <div className="mt-6">
        <ResourceManager cfg={cfg} />
      </div>
    </div>
  );
}
