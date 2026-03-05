import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (!session.user.onboarded) redirect("/onboarding");

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
