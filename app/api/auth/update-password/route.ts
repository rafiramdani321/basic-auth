import { AppError } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/responses";
import { updatePassword } from "@/service/user-service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const data = await req.json();

  try {
    await updatePassword(data);
    return successResponse(
      "Update password successfully, please login.",
      200,
      null
    );
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Something went wrong.", 500);
  }
}
