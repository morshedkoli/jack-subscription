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
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-8 scrollbar-thin">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
