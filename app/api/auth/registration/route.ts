import { NextRequest, NextResponse } from "next/server";

import { registrationService } from "@/service/user-service";
import { errorResponse, successResponse } from "@/lib/responses";
import { AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await registrationService(data);
    return successResponse("Registration successfully", 201, null);
  } catch (error: any) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal Server Error", 500);
  }
}
