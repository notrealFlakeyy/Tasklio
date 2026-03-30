import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardContext } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireDashboardContext();

  return (
    <DashboardShell
      organizationName={context.organization.name}
      organizationSlug={context.organization.slug}
    >
      {children}
    </DashboardShell>
  );
}
