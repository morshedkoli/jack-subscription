import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

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

    const record = await prisma.domain.findUnique({
      where: { domain },
      select: { domain: true, expiresAt: true },
    });

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "no-store, max-age=0",
    };

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
        { headers: corsHeaders }
      );
    }

    const now = new Date();
    const expired = record.expiresAt.getTime() < now.getTime();

    return NextResponse.json(
      {
        domain: record.domain,
        available: true,
        status: expired ? "expired" : "subscribed",
        subscribed: !expired,
        expired,
        expiresAt: record.expiresAt.toISOString(),
      },
      { headers: corsHeaders }
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
