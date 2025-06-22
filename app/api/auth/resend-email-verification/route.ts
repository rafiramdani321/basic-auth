import { sendMail } from "@/lib/email";
import { AppError } from "@/lib/errors";
import { resendEmailLogger } from "@/lib/logger/resend-email-logger";
import { errorResponse, successResponse } from "@/lib/responses";
import {
  createToken,
  deleteTokenByUserId,
} from "@/repositories/token-repository";
import { findUserByEmail } from "@/repositories/user-repository";
import { emailVerificationToken } from "@/utils/jwt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const email = await req.json();
  try {
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

    resendEmailLogger.info({
      event: "resend_email_success",
      email: user.email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return successResponse(
      "Resend verification successfully, Please check your email.",
      200
    );
  } catch (error) {
    if (error instanceof AppError) {
      resendEmailLogger.error({
        event: "resend_email_failed",
        email: email,
        ip,
        userAgent,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal server error", 500);
  }
}
