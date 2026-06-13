import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Dashboard — Motometrix",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name ?? "there",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
    />
  );
}
