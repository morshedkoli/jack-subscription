import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-emerald-500/5">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-4 p-3 sm:p-5 lg:p-8 pt-16 lg:pt-8 overflow-y-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
