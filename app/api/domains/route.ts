import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { domainSchema } from "@/lib/validations";

type AdminSession = { user?: { role?: string } | null } | null;

function ensureAdmin(session: AdminSession) {
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  try {
    const session = await auth();
    const guard = ensureAdmin(session);
    if (guard) return guard;

    const domains = await prisma.domain.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      domains: domains.map((d) => ({
        id: d.id,
        domain: d.domain,
        expiresAt: d.expiresAt.toISOString(),
        notes: d.notes,
        createdAt: d.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get domains error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const guard = ensureAdmin(session);
    if (guard) return guard;

    const body = await request.json();
    const payload = domainSchema.parse(body);

    const domain = await prisma.domain.upsert({
      where: { domain: payload.domain },
      update: {
        expiresAt: payload.expiresAt,
        notes: payload.notes ?? "",
      },
      create: {
        domain: payload.domain,
        expiresAt: payload.expiresAt,
        notes: payload.notes ?? "",
      },
    });

    return NextResponse.json({
      domain: {
        id: domain.id,
        domain: domain.domain,
        expiresAt: domain.expiresAt.toISOString(),
        notes: domain.notes,
      },
    });
  } catch (error) {
    console.error("Upsert domain error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
