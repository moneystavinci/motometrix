import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        accessToken: true,
        refreshToken: true,
        tokenExpiresAt: true,
        ga4PropertyId: true,
      },
    });

    if (!dbUser?.accessToken || !dbUser?.refreshToken) {
      return NextResponse.json({ properties: [], selectedPropertyId: null });
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

    const analyticsAdmin = google.analyticsadmin({ version: "v1beta", auth: oauth2Client });

    const accountsRes = await analyticsAdmin.accounts.list();
    const accounts = accountsRes.data.accounts ?? [];

    const allProperties = [];
    for (const account of accounts) {
      if (!account.name) continue;
      const propsRes = await analyticsAdmin.properties.list({
        filter: `parent:${account.name}`,
        pageSize: 50,
      });
      const props = propsRes.data.properties ?? [];
      for (const prop of props) {
        allProperties.push({
          id: prop.name?.replace("properties/", "") ?? "",
          displayName: prop.displayName ?? "Unnamed property",
          websiteUrl: null as string | null,
        });
      }
    }

    // Try to get website URLs from data streams
    for (const prop of allProperties) {
      try {
        const streamsRes = await analyticsAdmin.properties.dataStreams.list({
          parent: `properties/${prop.id}`,
        });
        const webStream = streamsRes.data.dataStreams?.find(
          (s) => s.type === "WEB_DATA_STREAM"
        );
        if (webStream?.webStreamData?.defaultUri) {
          prop.websiteUrl = webStream.webStreamData.defaultUri;
        }
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({
      properties: allProperties,
      selectedPropertyId: dbUser.ga4PropertyId,
    });
  } catch (err) {
    console.error("[GA4 Properties]", err);
    return NextResponse.json({ properties: [], selectedPropertyId: null });
  }
}
