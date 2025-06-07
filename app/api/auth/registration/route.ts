import { NextRequest, NextResponse } from "next/server";

import { registrationService } from "@/service/user-service";
import { errorResponse, successResponse } from "@/lib/responses";
import { AppError } from "@/lib/errors";
import { registrationLogger } from "@/lib/logger/logger-registration";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const data = await req.json();
  try {
    await registrationService(data);

    registrationLogger.info({
      event: "registration_success",
      email: data?.email,
      ip,
      userAgent,
      timesstamp: new Date().toISOString(),
    });

    return successResponse("Registration successfully", 201, null);
  } catch (error: any) {
    if (error instanceof AppError) {
      registrationLogger.info({
        event: "registration_failed",
        email: data?.email,
        ip,
        userAgent,
        error: error.message,
        timesstamp: new Date().toISOString(),
      });
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal Server Error", 500);
  }
}
