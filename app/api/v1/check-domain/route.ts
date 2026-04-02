import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

function normalizeDomain(input: string) {
  return input.trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainParam = searchParams.get("domain");

    if (!domainParam) {
      return NextResponse.json({ error: "domain query param is required" }, { status: 400 });
    }

    const domain = normalizeDomain(domainParam);
    const db = connectDB();

    const record = db
      .prepare(
        `SELECT domain, expires_at AS expiresAt
         FROM domains
         WHERE domain = ?`
      )
      .get(domain) as { domain: string; expiresAt: string } | undefined;
    if (!record) {
      return NextResponse.json(
        {
          domain,
          available: false,
          status: "not_found",
          subscribed: false,
          expired: true,
          expiresAt: null,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    const now = new Date();
    const expiresAtDate = new Date(record.expiresAt);
    const expired = expiresAtDate.getTime() < now.getTime();

    return NextResponse.json(
      {
        domain: record.domain,
        available: true,
        status: expired ? "expired" : "subscribed",
        subscribed: !expired,
        expired,
        expiresAt: expiresAtDate.toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Public domain check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
