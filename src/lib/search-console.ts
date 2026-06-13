import { google } from "googleapis";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { getMockSearchConsoleMetrics } from "@/types/analytics";
import type { SearchConsoleMetrics } from "@/types/analytics";

export type { SearchConsoleMetrics } from "@/types/analytics";
export { getMockSearchConsoleMetrics } from "@/types/analytics";

export async function fetchSearchConsoleMetrics(
  userId: string
): Promise<SearchConsoleMetrics> {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser?.accessToken || !dbUser?.refreshToken) {
      return getMockSearchConsoleMetrics();
    }

    const accessToken = await decrypt(dbUser.accessToken);
    const refreshToken = await decrypt(dbUser.refreshToken);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: dbUser.tokenExpiresAt?.getTime(),
    });

    const searchConsole = google.searchconsole({ version: "v1", auth: oauth2Client });

    // Discover site URL — prefer stored value, fall back to first verified property
    const sites = await searchConsole.sites.list();
    const siteUrl = dbUser.websiteUrl ?? sites.data.siteEntry?.[0]?.siteUrl;

    if (!siteUrl) return getMockSearchConsoleMetrics();

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const [summary, keywords] = await Promise.all([
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions: [] },
      }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 5,
        },
      }),
    ]);

    const row = summary.data.rows?.[0];

    return {
      totalClicks: row?.clicks ?? 0,
      totalImpressions: row?.impressions ?? 0,
      avgPosition: row?.position ? Math.round(row.position * 10) / 10 : 0,
      topKeywords: (keywords.data.rows ?? []).map((r) => ({
        keyword: r.keys?.[0] ?? "",
        clicks: r.clicks ?? 0,
        position: r.position ? Math.round(r.position * 10) / 10 : 0,
      })),
      isDemo: false,
    };
  } catch {
    return getMockSearchConsoleMetrics();
  }
}
