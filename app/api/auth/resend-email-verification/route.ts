import { sendMail } from "@/lib/email";
import { AppError } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/responses";
import {
  createToken,
  deleteTokenByUserId,
} from "@/repositories/token-repository";
import { findUserByEmail } from "@/repositories/user-repository";
import { emailVerificationToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const email = await req.json();

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("Email not found.", 400);
    }

    const token = emailVerificationToken(email);
    const one_hour = 60 * 60 * 1000;

    const newTokenData = {
      userId: user.id,
      token,
      verifyExp: new Date(Date.now() + one_hour),
    };
    await deleteTokenByUserId(user.id);
    await createToken(newTokenData);

    const url = `${process.env
      .NEXT_PUBLIC_BASE_URL!}/auth/verify-account/${token}`;
    const message = `<p>Click the link below to verify your email</p><a href="${url}">${url}</a>`;
    await sendMail(user.email, `Verification account : `, message);

    return successResponse(
      "Resend verification successfully, Please check your email.",
      200
    );
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal server error", 500);
  }
}
