import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingHero from "@/components/landing/LandingHero";

export default async function HomePage() {
  const session = await auth();

  // Already authenticated → skip to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LandingHero />;
}
