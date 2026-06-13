import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/funnel-users
 *
 * Protected admin endpoint for reviewing lead generation data.
 * Requires: Authorization: Bearer <ADMIN_SECRET_KEY>
 *
 * Example usage:
 *   curl -H "Authorization: Bearer your-secret" https://yourdomain.com/api/admin/funnel-users
 */
export async function GET(request: NextRequest) {
  // Strict secret handshake
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret) {
    return NextResponse.json({ error: "Admin endpoint not configured." }, { status: 503 });
  }

  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        websiteUrl: true,
        mailchimpSynced: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      total: users.length,
      synced: users.filter((u) => u.mailchimpSynced).length,
      users,
    });
  } catch (error) {
    console.error("[Admin API]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
