import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchGA4Metrics, getMockGA4Metrics } from "@/lib/google-analytics";
import { fetchSearchConsoleMetrics, getMockSearchConsoleMetrics } from "@/lib/search-console";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Look up user — check they have tokens (set after first OAuth sign-in)
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, accessToken: true, refreshToken: true },
    });

    // No tokens yet → serve demo data (shouldn't normally happen post-login)
    if (!dbUser?.accessToken || !dbUser?.refreshToken) {
      return NextResponse.json({
        ga4: getMockGA4Metrics(),
        searchConsole: getMockSearchConsoleMetrics(),
        isDemo: true,
      });
    }

    const [ga4Result, scResult] = await Promise.allSettled([
      fetchGA4Metrics(userId),
      fetchSearchConsoleMetrics(userId),
    ]);

    const ga4 = ga4Result.status === "fulfilled" ? ga4Result.value : getMockGA4Metrics();
    const searchConsole =
      scResult.status === "fulfilled" ? scResult.value : getMockSearchConsoleMetrics();

    // isDemo = true when GA4 has no real property connected
    const isDemo = ga4.propertyId === null;

    return NextResponse.json({ ga4, searchConsole, isDemo });
  } catch (error) {
    console.error("[Analytics API]", error);
    return NextResponse.json({
      ga4: getMockGA4Metrics(),
      searchConsole: getMockSearchConsoleMetrics(),
      isDemo: true,
    });
  }
}
