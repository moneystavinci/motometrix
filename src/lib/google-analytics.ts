import { google } from "googleapis";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import type { GA4Metrics } from "@/types/analytics";
import { getMockGA4Metrics } from "@/types/analytics";

export type { GA4Metrics } from "@/types/analytics";
export { getMockGA4Metrics } from "@/types/analytics";

async function getAuthenticatedClient(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
      tokenExpiresAt: true,
      websiteUrl: true,
      ga4PropertyId: true,
    },
  });

  if (!dbUser) throw new Error("User not found");
  if (!dbUser.accessToken || !dbUser.refreshToken) {
    throw new Error("User has no stored tokens — demo mode active");
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

  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      const encrypted = await import("@/lib/encryption").then((m) =>
        m.encrypt(tokens.access_token!)
      );
      await prisma.user.update({
        where: { id: userId },
        data: {
          accessToken: encrypted,
          tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        },
      });
    }
  });

  return { oauth2Client, dbUser };
}

export async function fetchGA4Metrics(userId: string): Promise<GA4Metrics> {
  try {
    const { oauth2Client, dbUser } = await getAuthenticatedClient(userId);

    const analyticsAdmin = google.analyticsadmin({ version: "v1beta", auth: oauth2Client });

    // Use saved property ID if available, otherwise auto-detect first property
    let propertyId = dbUser.ga4PropertyId ?? null;
    let websiteUrl = dbUser.websiteUrl ?? null;

    if (!propertyId) {
      const accountsRes = await analyticsAdmin.accounts.list();
      const account = accountsRes.data.accounts?.[0];
      if (account?.name) {
        const propertiesRes = await analyticsAdmin.properties.list({
          filter: `parent:${account.name}`,
          pageSize: 1,
        });
        const property = propertiesRes.data.properties?.[0];
        propertyId = property?.name?.replace("properties/", "") ?? null;

        // Auto-detect website URL from data stream
        if (property?.name && !websiteUrl) {
          try {
            const streams = await analyticsAdmin.properties.dataStreams.list({
              parent: property.name,
            });
            const webStream = streams.data.dataStreams?.find(
              (s) => s.type === "WEB_DATA_STREAM"
            );
            if (webStream?.webStreamData?.defaultUri) {
              websiteUrl = webStream.webStreamData.defaultUri;
              await prisma.user.update({ where: { id: userId }, data: { websiteUrl } });
            }
          } catch {
            // Non-critical
          }
        }
      }
    }

    if (!propertyId) {
      console.error("[GA4] No property ID found, returning mock data");
      return getMockGA4Metrics();
    }

    const analyticsData = google.analyticsdata({ version: "v1beta", auth: oauth2Client });

    const [currentReport, previousReport, topPagesReport, topSourceReport, dailyReport] =
      await Promise.all([
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [{ name: "totalUsers" }, { name: "averageSessionDuration" }],
          },
        }),
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
            metrics: [{ name: "totalUsers" }],
          },
        }),
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
            limit: "5",
          },
        }),
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
            limit: "1",
          },
        }),
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "date" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
          },
        }),
      ]);

    const totalVisitors =
      parseInt(currentReport.data.rows?.[0]?.metricValues?.[0]?.value ?? "0") || 0;
    const avgDuration =
      parseFloat(currentReport.data.rows?.[0]?.metricValues?.[1]?.value ?? "0") || 0;
    const previousVisitors =
      parseInt(previousReport.data.rows?.[0]?.metricValues?.[0]?.value ?? "0") || 0;

    const growthPercent =
      previousVisitors > 0
        ? Math.round(((totalVisitors - previousVisitors) / previousVisitors) * 100)
        : 0;

    const topSource =
      topSourceReport.data.rows?.[0]?.dimensionValues?.[0]?.value ?? "Direct";
    const friendlySource = friendlyChannelName(topSource);

    const topPages: Array<{ page: string; visitors: number }> = (
      topPagesReport.data.rows ?? []
    ).map((row) => ({
      page: row.dimensionValues?.[0]?.value ?? "/",
      visitors: parseInt(row.metricValues?.[0]?.value ?? "0"),
    }));

    const dailyVisitors: Array<{ date: string; visitors: number }> = (
      dailyReport.data.rows ?? []
    ).map((row) => {
      const raw = row.dimensionValues?.[0]?.value ?? "";
      const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return {
        date: formatted,
        visitors: parseInt(row.metricValues?.[0]?.value ?? "0"),
      };
    });

    return {
      totalVisitors,
      avgSessionDurationSeconds: Math.round(avgDuration),
      topSource: friendlySource,
      dailyVisitors,
      topPages,
      previousPeriodVisitors: previousVisitors,
      growthPercent,
      propertyId,
      websiteUrl,
    };
  } catch (err) {
    console.error("[GA4] fetchGA4Metrics error:", err);
    return getMockGA4Metrics();
  }
}

function friendlyChannelName(channel: string): string {
  const map: Record<string, string> = {
    "Organic Search": "Google Search",
    "Direct": "Direct visits",
    "Referral": "Other websites",
    "Organic Social": "Social media",
    "Paid Search": "Paid ads",
    "Email": "Email campaigns",
    "Display": "Display ads",
  };
  return map[channel] ?? channel;
}
