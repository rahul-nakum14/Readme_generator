import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const geo = (request as any).geo || {};
  const ip = (request as any).ip || "Unknown";
  const ua = (request as any).headers.get("user-agent") || "Unknown";

  const visitData = {
    country: geo?.country || "Unknown",
    region: geo?.region || "Unknown",
    city: geo?.city || "Unknown",
    ip: ip,
    userAgent: ua,
    timestamp: new Date().toISOString(),
  };

  // Log the visit data
  console.log("Visit logged: ********************", JSON.stringify(visitData));

  // Here you could also send this data to a database or analytics service
  // For example, you could use a serverless database like Fauna or a logging service like Logtail

  return NextResponse.json({ success: true });
}
