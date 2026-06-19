import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ga4PropertyId, searchConsoleUrl } = await req.json();

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      ga4PropertyId: ga4PropertyId || null,
      searchConsoleUrl: searchConsoleUrl || null,
    },
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { ga4PropertyId: true, searchConsoleUrl: true },
  });

  return NextResponse.json(user);
}