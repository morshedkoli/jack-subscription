import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
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

    const db = connectDB();
    const domains = db
      .prepare(
        `SELECT id, domain, expires_at AS expiresAt, notes, created_at AS createdAt
         FROM domains
         ORDER BY created_at DESC`
      )
      .all() as Array<{
      id: number;
      domain: string;
      expiresAt: string;
      notes: string;
      createdAt: string;
    }>;

    return NextResponse.json({
      domains: domains.map((d) => ({
        id: d.id.toString(),
        domain: d.domain,
        expiresAt: d.expiresAt,
        notes: d.notes ?? "",
        createdAt: d.createdAt,
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

    const db = connectDB();
    const body = await request.json();
    const payload = domainSchema.parse(body);
    const now = new Date().toISOString();
    const expiresAt = payload.expiresAt.toISOString();

    db.prepare(
      `INSERT INTO domains (domain, expires_at, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         expires_at = excluded.expires_at,
         notes = excluded.notes,
         updated_at = excluded.updated_at`
    ).run(payload.domain, expiresAt, payload.notes ?? "", now, now);

    const domain = db
      .prepare(
        `SELECT id, domain, expires_at AS expiresAt, notes
         FROM domains
         WHERE domain = ?`
      )
      .get(payload.domain) as
      | { id: number; domain: string; expiresAt: string; notes: string }
      | undefined;

    if (!domain) {
      throw new Error("Failed to upsert domain");
    }

    return NextResponse.json({
      domain: {
        id: domain.id.toString(),
        domain: domain.domain,
        expiresAt: domain.expiresAt,
        notes: domain.notes ?? "",
      },
    });
  } catch (error) {
    console.error("Upsert domain error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const guard = ensureAdmin(session);
    if (guard) return guard;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Domain id is required" }, { status: 400 });
    }

    const db = connectDB();
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return NextResponse.json({ error: "Invalid domain id" }, { status: 400 });
    }

    db.prepare("DELETE FROM domains WHERE id = ?").run(parsedId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete domain error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
