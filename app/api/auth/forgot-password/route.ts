import { sendMail } from "@/lib/email";
import { AppError } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/responses";
import { createToken } from "@/repositories/token-repository";
import { findUserByEmail } from "@/repositories/user-repository";
import { signForgetPasswordToken } from "@/utils/jwt";
import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(req: NextRequest) {
  const email = await req.json();

  try {
    if (!email || email === null) {
      throw new AppError("Email is required!", 400);
    }

    const emailExist = await findUserByEmail(email);
    if (!emailExist) {
      throw new AppError("Email is not registered yet.", 400);
    }

    const token = signForgetPasswordToken(email);
    const one_hour = 60 * 60 * 1000;
    const newTokenData = {
      userId: emailExist.id,
      token,
      verifyExp: new Date(Date.now() + one_hour),
    };
    await createToken(newTokenData);

    const url = `${BASE_URL}/auth/reset-password/${token}`;
    const message = `<p>Click the link below to reset your password</p><a href="${url}">${url}</a>`;
    await sendMail(email, `Reset password : `, message);

    return successResponse("Please check your email for reset passsword.");
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal server error", 500);
  }
}
