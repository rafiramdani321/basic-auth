import { AppError } from "@/lib/errors";
import { signToken } from "@/lib/jwt";
import { errorResponse, successResponse } from "@/lib/responses";
import { loginService } from "@/service/user-service";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const user = await loginService(data);

    const token = signToken(
      { id: user.id, email: user.email, username: user.username },
      "1h"
    );
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return successResponse("Login successfully", 200, user);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal Server Error", 500);
  }
}
