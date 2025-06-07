import { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { errorResponse, successResponse } from "@/lib/responses";
import { logoutLogger } from "@/lib/logger/logout-logger";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const data = await req.json();
  try {
    cookies().set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    logoutLogger.info({
      event: "logout_success",
      email: data.email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
    return successResponse("Logout success", 200);
  } catch (error) {
    logoutLogger.error({
      event: "logout_failed",
      email: data.email,
      ip,
      userAgent,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
    return errorResponse("Internal Server Error", 500);
  }
}
